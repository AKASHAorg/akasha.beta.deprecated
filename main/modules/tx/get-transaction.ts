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
        return GethConnector.getInstance().web3.eth.getTransactionReceiptAsync(txHash);
    });
    return Promise.all(requests);
});

export default { execute, name: 'getTransaction' };
