import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';

/**
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: {follower: string, akashaId: string}) {
    const count = yield contracts.instance.feed.isFollowing(data.follower, data.akashaId);
    return { count, follower: data.follower, akashaId: data.akashaId }
});

export default { execute, name: 'isFollowing' };
