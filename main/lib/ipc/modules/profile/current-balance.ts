import * as Promise from 'bluebird';
import { GethConnector } from '@akashaproject/geth-connector';

/**
 * Get eth balance converted to specified unit
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: BalanceRequest) {
    const etherBase = (data.etherBase) ? data.etherBase : GethConnector.getInstance().web3.eth.defaultAccount;
    const unit = (data.unit) ? data.unit : 'ether';
    const weiAmount = yield GethConnector.getInstance().web3.eth.getBalanceAsync(etherBase);
    const balance = GethConnector.getInstance().web3.fromWei(weiAmount, unit);
    return { balance: balance.toString(10), unit, etherBase };
});

export default { execute, name: 'getBalance' };
