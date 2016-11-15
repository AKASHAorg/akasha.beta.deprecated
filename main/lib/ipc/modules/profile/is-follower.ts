import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';

/**
 * Check if someone is follower
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: {following: string, akashaId: string}) {
    const count = yield contracts.instance.feed.isFollower(data.akashaId, data.following);
    return { count, following: data.following, akashaId: data.akashaId }
});

export default { execute, name: 'isFollower' };
