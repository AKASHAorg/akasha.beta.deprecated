import * as Promise from 'bluebird';
import { dbs } from './indexes';
import schema from '../utils/jsonschema';


const flush = {
    'id': '/flush',
    'type': 'object',
    'properties': {
        'target': { 'type': 'string' }
    },
    'required': ['target']
};

const execute = Promise.coroutine(function* (data: { target: string }, cb) {
    const v = new schema.Validator();
    v.validate(data, flush, { throwError: true });

    const modules = ['entry', 'tags', 'profiles'];
    if (modules.indexOf(data.target) === -1) {
        throw new Error('target is not recognized');
    }

    dbs[data.target].searchIndex.flush(function (err) {
        if (err) {
            return cb(err);
        }
        cb('', { done: true });
    });
    return { done: false };
});

export default { execute, name: 'flush', hasStream: true };
