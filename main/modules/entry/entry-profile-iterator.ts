import * as Promise from 'bluebird';

/**
 * Get entries indexed by publisher
 * @type {Function}
 */
const execute = Promise.coroutine(function* () {
    throw new Error('entry:entryProfileIterator deprecated');
});

export default { execute, name: 'entryProfileIterator' };

