import * as Promise from 'bluebird';
import { GethConnector } from '@akashaproject/geth-connector';
import schema from '../utils/jsonschema';

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
    const weiAmount = yield GethConnector.getInstance().web3.eth.getBalanceAsync(etherBase);
    const balance = GethConnector.getInstance().web3.fromWei(weiAmount, unit);
    return { balance: balance.toString(10), unit, etherBase };
});

export default { execute, name: 'getBalance' };
