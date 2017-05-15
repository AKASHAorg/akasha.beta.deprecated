import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';

/**
 * @type {Function}
 */
const execute = Promise.coroutine(
    /**
     *
     * @param data
     * @returns {{collection: any}}
     */
    function*(data: { follower: string, akashaId: string }[]) {
        if (!Array.isArray(data)) {
            throw new Error('data is must be an array');
        }
        const requests = data.map((req) => {
            return contracts.instance.feed.isFollowing(req.follower, req.akashaId)
                .then((result) => {
                    return { result, follower: req.follower, akashaId: req.akashaId };
                });
        });
        const collection = yield Promise.all(requests);
        return { collection };
    });

export default { execute, name: 'isFollowing' };
