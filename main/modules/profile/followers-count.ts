import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import { profileAddress } from './helpers';

/**
 * Get total number of followers
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: GetFollowerCountRequest) {
    const address = yield profileAddress(data);
    const count = yield contracts.instance.Feed.totalFollowers(address);
    return { count: count.toString(10), akashaId: data.akashaId };
});

export default { execute, name: 'getFollowersCount' };
