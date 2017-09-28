import * as Promise from 'bluebird';
import { gethHelper } from '@akashaproject/geth-connector';
import schema from '../utils/jsonschema';

const addToQueue = {
    'id': '/addToQueue',
    'type': 'array',
    'items': {
        'type': 'object',
        'properties': {
            'tx': { 'type': 'string' }
        },
        'required': ['tx']
    }
};

const execute = Promise.coroutine(function* (data: AddToQueueRequest[]) {
    const v = new schema.Validator();
    v.validate(data, addToQueue, { throwError: true });

    data.forEach((hash) => {
        gethHelper.addTxToWatch(hash.tx, false);
    });
    gethHelper.startTxWatch();
    return { watching: gethHelper.watching };
});

export default { execute, name: 'addToQueue' };
