import * as Promise from 'bluebird';

/**
 * Get entries indexed by tag
 * @type {Function}
 */
const execute = Promise.coroutine(function* () {
    throw new Error('entry:entryTagIterator is deprecated');
});

export default { execute, name: 'entryTagIterator' };

