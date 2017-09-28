import * as Promise from 'bluebird';
import { gethHelper } from '@akashaproject/geth-connector';
import schema from '../utils/jsonschema';

const emitMined = {
    'id': '/emitMined',
    'type': 'object',
    'properties': {
        'watch': { 'type': 'bool' }
    },
    'required': ['watch']

};

const execute = Promise.coroutine(function* (data: EmitMinedRequest) {
    const v = new schema.Validator();
    v.validate(data, emitMined, { throwError: true });

    (data.watch) ? gethHelper.startTxWatch() : gethHelper.stopTxWatch();
    return { watching: gethHelper.watching };
});

export default { execute, name: 'emitMined' };
