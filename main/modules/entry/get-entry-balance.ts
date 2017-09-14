import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import { GethConnector } from '@akashaproject/geth-connector';

/**
 * Get current balance of an entry
 * @type {Function}
 */
const execute = Promise.coroutine(
    /**
     *
     * @param data
     * @returns {{collection: any}}
     */
    function* (data: { entryId: string[], unit: 'ether' }) {
        if (!Array.isArray(data.entryId)) {
            throw new Error('data.entryId must be an array');
        }

        const requests = data.entryId.map((id) => {
            return contracts.instance.entries
                .getEntryFund(id)
                .then((balanceAddress) => {
                    if (!balanceAddress) {
                        return { balance: 'claimed', unit: data.unit, entryId: id };
                    }
                    return GethConnector.getInstance().web3.eth.getBalanceAsync(balanceAddress)
                        .then((weiAmount) => {
                            const balance = GethConnector.getInstance().web3.fromWei(weiAmount, data.unit);
                            return { balance: balance.toString(10), unit: data.unit, entryId: id };
                        });
                });
        });

        const collection = yield Promise.all(requests);
        return { collection };
    });

export default { execute, name: 'getEntryBalance' };
