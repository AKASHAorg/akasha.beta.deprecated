import * as Promise from 'bluebird';
import { dbs } from './indexes';

const execute = Promise.coroutine(function* (data, cb) {
    dbs.entry.searchIndex.flush(function(err) {
        if (err) { return cb(err); }
        cb('', { done: true });
    });
    return { done: false };
});

export default { execute, name: 'flush', hasStream: true };
