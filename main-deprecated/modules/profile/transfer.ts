import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import { profileAddress } from './helpers';
import schema from '../utils/jsonschema';
import GethConnector from '@akashaproject/geth-connector/lib/GethConnector';

export const transfer = {
    'id': '/transfer',
    'type': 'object',
    'properties': {
        'ethAddress': { 'type': 'string', 'format': 'address' },
        'akashaId': { 'type': 'string' },
        'token': { 'type': 'string' },
        'value': { 'type': 'string' },
        'tokenAmount': { 'type': 'string' },
    },
    'required': ['token']
};

const execute = Promise.coroutine(
    function* (data: {
        token: string,
        akashaId?: string,
        ethAddress?: string,
        value?: string,
        tokenAmount?: string,
    }, cb) {
        const v = new schema.Validator();
        v.validate(data, transfer, { throwError: true });

        if (data.tokenAmount && data.value) {
            throw new Error('Can only send eth or aeth token individually, not combined');
        }
        const address = yield profileAddress(data);
        const tokenAmount = GethConnector.getInstance().web3.toWei(data.tokenAmount || 0, 'ether');
        const ethAmount = GethConnector.getInstance().web3.toWei(data.value || 0, 'ether');
        let txData;
        if (data.tokenAmount) {
            txData = contracts.instance.AETH.transfer.request(address, tokenAmount, { gas: 200000 });
        } else if (data.value) {
            txData = GethConnector.getInstance().web3.eth.sendTransaction.request({ to: address, value: ethAmount, gas: 50000 });
        }
        const transaction = yield contracts.send(txData, data.token, cb);
        return {
            tx: transaction.tx,
            receipt: transaction.receipt,
            receiver: address,
            akashaId: data.akashaId
        };
    });

export default { execute, name: 'transfer', hasStream: true };
