import * as Promise from 'bluebird';
import { GethConnector } from '@akashaproject/geth-connector';
import schema from '../utils/jsonschema';
import contracts from '../../contracts/index';
import { profileAddress } from './helpers';
import { ascend, difference, filter, prop, sortWith } from 'ramda';

export const cyclingStates = {
    'id': '/cyclingStates',
    'type': 'object',
    'properties': {
        'akashaId': { 'type': 'string' },
        'ethAddress': { 'type': 'string', 'format': 'address' }
    }
};
/**
 *
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: { akashaId?: string, ethAddress?: string }) {
    const v = new schema.Validator();
    v.validate(data, cyclingStates, { throwError: true });

    const address = yield profileAddress(data);
    const collection = [];
    let finished = false;
    let currentIndex = 0;
    while (!finished) {
        const [_amount, _unlockDate, _index] = yield contracts.instance.AETH.getCyclingState(address, currentIndex);
        if (_amount.toNumber() === 0) {
            finished = true;
            continue;
        }
        collection.push({
            amount: (GethConnector.getInstance().web3.fromWei(_amount, 'ether')).toFormat(5),
            unlockDate: _unlockDate.toNumber()
        });
        currentIndex = _index.toNumber() + 1;
    }

    const sorted = sortWith([ascend(prop('unlockDate')), ascend(prop('amount'))], collection);
    const now = new Date().getTime() / 1000;
    const rule = (state) => state.unlockDate < now;
    const available = filter(rule, sorted);
    const totalAvailable = available.reduce((acc, curr) => {
        return acc.plus(curr.amount);
    }, new (GethConnector.getInstance()).web3.BigNumber(0));
    const pending = difference(sorted, available);
    const totalPending = pending.reduce((acc, curr) => {
        return acc.plus(curr.amount);
    }, new (GethConnector.getInstance()).web3.BigNumber(0));
    return {
        available: { collection: available, total: totalAvailable.toFormat(5) },
        pending: { collection: pending, total: totalPending.toFormat(5) }
    };
});

export default { execute, name: 'cyclingStates' };
