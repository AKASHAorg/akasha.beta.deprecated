import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';
import { GethConnector } from '@akashaproject/geth-connector';

/**
 * Get current balance of an entry
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: {entryId: string}) {
    const balanceAddress = yield contracts.instance.entries.getEntryFund(data.entryId);
    if(!balanceAddress) {
        return { balance: 'claimed', unit: '', entryId: data.entryId };
    }
    const weiAmount = yield GethConnector.getInstance().web3.eth.getBalanceAsync(balanceAddress);
    const balance = GethConnector.getInstance().web3.fromWei(weiAmount, 'ether');

    return { balance: balance.toString(10), unit: 'ether', entryId: data.entryId };
});

export default { execute, name: 'getEntryBalance' };
