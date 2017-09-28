import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import { profileAddress } from './helpers';
import schema from '../utils/jsonschema';

export const tip = {
    'id': '/tip',
    'type': 'object',
    'properties': {
        'ethAddress': { 'type': 'string', 'format': 'address' },
        'akashaId': { 'type': 'string' },
        'token': { 'type': 'string' },
        'value': { 'type': 'string' },
        'tokenAmount': { 'type': 'string' },
        'message': { 'type': 'string' }
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
        message?: string
    }, cb) {
        const v = new schema.Validator();
        v.validate(data, tip, { throwError: true });

        const address = yield profileAddress(data);
        const txData = yield contracts.instance.AETH.donate.request(address, data.tokenAmount, data.message, {
            value: data.value,
            gas: 200000
        });
        const transaction = yield contracts.send(txData, data.token, cb);
        return {
            tx: transaction.tx,
            receipt: transaction.receipt,
            receiver: address,
            akashaId: data.akashaId,
            hasStream: true
        };
    });

export default { execute, name: 'tip' };
