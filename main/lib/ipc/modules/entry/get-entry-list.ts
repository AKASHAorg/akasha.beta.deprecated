import * as Promise from 'bluebird';
import getEntry from './get-entry';

/**
 * Resolve a list of entries
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: {entryId: string}[]) {
    const pool = data.map((entryObj) => {
        return getEntry.execute(entryObj);
    });
    const resolved = yield Promise.all(pool);
    return { collection: resolved };
});

export default { execute, name: 'getEntryList' };
