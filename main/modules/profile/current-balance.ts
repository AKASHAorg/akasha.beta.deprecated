import * as Promise from 'bluebird';
import { GethConnector } from '@akashaproject/geth-connector';
import schema from '../utils/jsonschema';
import contracts from '../../contracts/index';

export const getBalance = {
    'id': '/getBalance',
    'type': 'object',
    'properties': {
        'ethAddress': { 'type': 'string', 'format': 'address' },
        'unit': { 'type': 'string' }
    }
};
/**
 * Get eth balance converted to specified unit
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: BalanceRequest) {
    const v = new schema.Validator();
    v.validate(data, getBalance, { throwError: true });

    const etherBase = (data.ethAddress) ? data.ethAddress : GethConnector.getInstance().web3.eth.defaultAccount;
    const unit = (data.unit) ? data.unit : 'ether';
    const fromWei = GethConnector.getInstance().web3.fromWei;
    const weiAmount = yield GethConnector.getInstance().web3.eth.getBalanceAsync(etherBase);
    const [free, bonded, cycling] = yield contracts.instance.AETH.getTokenRecords(etherBase);
    const [manaTotal, manaSpent, manaRemaining] = yield contracts.instance.Essence.mana(etherBase);
    const symbol = yield contracts.instance.AETH.symbol();
    const totalAeth = free.plus(bonded).plus(cycling);
    const balance = fromWei(weiAmount, unit);
    return {
        balance: balance.toFormat(5),
        [symbol]: {
            total: (fromWei(totalAeth)).toFormat(7),
            free: (fromWei(free)).toFormat(5),
            bonded: (fromWei(bonded)).toFormat(5),
            cycling: (fromWei(cycling)).toFormat(5),
        },
        mana: {
            total: (fromWei(manaTotal)).toFormat(5),
            spent: (fromWei(manaSpent)).toFormat(5),
            remaining: (fromWei(manaRemaining)).toFormat(5)
        }
        , unit, etherBase
    };
});

export default { execute, name: 'getBalance' };
