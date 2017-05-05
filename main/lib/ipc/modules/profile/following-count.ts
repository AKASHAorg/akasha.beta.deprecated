import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';
/**
 * Get total number of your follows
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: GetFollowerCountRequest) {
    const count = yield contracts.instance.feed.getFollowingCount(data.akashaId);
    return { count, akashaId: data.akashaId }
});

export default { execute, name: 'getFollowingCount' };
