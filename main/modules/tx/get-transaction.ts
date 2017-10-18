import * as Promise from 'bluebird';
import { GethConnector } from '@akashaproject/geth-connector';
import schema from '../utils/jsonschema';

const getTransaction = {
    'id': '/getTransaction',
    'type': 'object',
    'properties': {
        'transactionHash': {
            'type': 'array',
            'items': { 'type': 'string' }
        }
    },
    'required': ['transactionHash']

};

const execute = Promise.coroutine(function* (data: TxRequestData) {
    const v = new schema.Validator();
    v.validate(data, getTransaction, { throwError: true });

    const requests = data.transactionHash.map((txHash) => {
        return GethConnector
            .getInstance()
            .web3.eth
            .getTransactionReceiptAsync(txHash).then((receipt) => {
                if (receipt) {
                    return Object.assign({}, receipt, { success: receipt.status === '0x1' });
                }
                return GethConnector.getInstance()
                    .web3.eth
                    .getTransactionAsync(txHash)
                    .then((txHashData) => {
                        if (txHashData) {
                            return null;
                        }
                        throw new Error(`Tx: ${txHash} could not be found.`);
                    });
            });
    });
    return Promise.all(requests);
});

export default { execute, name: 'getTransaction' };
