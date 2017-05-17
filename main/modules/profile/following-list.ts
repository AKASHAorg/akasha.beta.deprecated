import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';

/**
 * Get following list of id
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: { akashaId: string }) {
    let currentId = yield contracts.instance.feed.getFollowingFirst(data.akashaId);
    if (currentId === '0') {
        return { collection: [], akashaId: data.akashaId };
    }
    let profileId;
    const results = [];
    profileId = yield contracts.instance.feed.getFollowingById(data.akashaId, currentId);
    results.push(profileId);

    while (currentId !== '0') {
        currentId = yield contracts.instance.feed.getFollowingNext(data.akashaId, currentId);
        if (currentId === '0') {
            break;
        }
        profileId = yield contracts.instance.feed.getFollowingById(data.akashaId, currentId);
        results.push(profileId);
    }
    return { collection: results, akashaId: data.akashaId };
});

export default { execute, name: 'getFollowingList' };
