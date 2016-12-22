import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';

/**
 * Get total number of followers
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: GetFollowerCountRequest) {
    const count = yield contracts.instance.feed.getFollowersCount(data.akashaId);
    return { count, akashaId: data.akashaId }
});

export default { execute, name: 'getFollowersCount' };
