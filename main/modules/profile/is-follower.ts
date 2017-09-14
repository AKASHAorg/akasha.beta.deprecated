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
    function* (data: { following: string, akashaId: string }[]) {
        if (!Array.isArray(data)) {
            throw new Error('data must be an array');
        }
        const requests = data.map((req) => {
            return contracts.instance.feed
                .isFollower(req.akashaId, req.following)
                .then((result) => {
                    return { result, following: req.following, akashaId: req.akashaId };
                });
        });

        const collection = yield Promise.all(requests);
        return { collection };
    });

export default { execute, name: 'isFollower' };
