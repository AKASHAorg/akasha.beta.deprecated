import * as Promise from 'bluebird';


/**
 * Get comments ipfs hashes for a profile
 * @param start {block number}
 * @type {Function}
 */
const execute = Promise.coroutine(function* () {
    throw new Error('getProfileComments:deprecated, use default iterator');
});

export default { execute, name: 'getProfileComments' };
