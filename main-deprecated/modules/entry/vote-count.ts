import * as Promise from 'bluebird';

/**
 * Get total number of votes for an entry
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: { entryId: string }) {
    throw new Error('entry:voteCount is deprecated');
});

export default { execute, name: 'voteCount' };
