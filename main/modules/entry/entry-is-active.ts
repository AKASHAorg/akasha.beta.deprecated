import * as Promise from 'bluebird';

/**
 * Check if can claim deposit from entry
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: { entryId: string }) {
    throw new Error('entry:isActive is no longer required');
});

export default { execute, name: 'isActive' };
