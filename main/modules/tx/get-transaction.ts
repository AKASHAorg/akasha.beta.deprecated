import * as Promise from 'bluebird';
import { GethConnector } from '@akashaproject/geth-connector';

const execute = Promise.coroutine(function* (data: TxRequestData) {
    const requests = data.transactionHash.map((txHash) => {
        return GethConnector.getInstance().web3.eth.getTransactionReceiptAsync(txHash);
    });
    return Promise.all(requests);
});

export default { execute, name: 'getTransaction' };
