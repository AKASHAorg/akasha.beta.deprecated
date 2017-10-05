import * as Promise from 'bluebird';

/**
 * Get following list of id
 * @type {Function}
 */
const execute = Promise.coroutine(function* () {
    throw new Error('getFollowingList:deprecated');
});

export default { execute, name: 'getFollowingList' };
