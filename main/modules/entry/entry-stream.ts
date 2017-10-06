import * as Promise from 'bluebird';

/**
 * Get score of an entry
 * @type {Function}
 */
const execute = Promise.coroutine(function* () {
    throw new Error('entry:getEntriesStream is no longer required');
});

export default { execute, name: 'getEntriesStream' };
