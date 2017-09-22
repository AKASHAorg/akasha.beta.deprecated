import * as Promise from 'bluebird';
import contracts from '../../contracts/index';

/**
 * Check if someone is follower
 * @type {Function}
 */
const execute = Promise.coroutine(
    /**
     *
     * @param data
     * @returns {{collection: any}}
     */
    function* (data: { addressFollower: string, addressFollowing: string }[]) {
        if (!Array.isArray(data)) {
            throw new Error('data must be an array');
        }
        const requests = data.map((req) => {
            return contracts.instance.Feed
                .follows(req.addressFollower, req.addressFollowing)
                .then((result) => {
                    return { result, addressFollower: req.addressFollower, addressFollowing: req.addressFollowing };
                });
        });

        const collection = yield Promise.all(requests);
        return { collection };
    });

export default { execute, name: 'isFollower' };
