import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import { GethConnector } from '@akashaproject/geth-connector';

/**
 * Get deposit balance
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: { entryId: string }) {
    const entryFund = yield contracts.instance.entries.getEntryFund(data.entryId);
    const weiBalance = yield GethConnector.getInstance().web3.eth.getBalanceAsync(entryFund);
    const ethBalance = (GethConnector.getInstance().web3.fromWei(weiBalance, 'ether')).toString(10);
    return { balance: ethBalance, entryId: data.entryId };
});

export default { execute, name: 'getDepositBalance' };
