import * as Promise from 'bluebird';
/**
 * @type {Function}
 */
const execute = Promise.coroutine(
    /**
     *
     * @param data
     * @returns {{collection: any}}
     */
    function* () {
        throw new Error('deprecated, use isFollower');
    });

export default { execute, name: 'isFollowing' };
