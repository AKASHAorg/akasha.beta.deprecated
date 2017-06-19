import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';
import profileData from './profile-data';
/**
 * Get followed profiles of id
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: { start?: number, limit?: number, akashaId: string, short: true }) {
    let currentId = (data.start) ? data.start : yield contracts.instance.feed.getFollowingFirst(data.akashaId);
    if (currentId === '0') {
        return { collection: [], akashaId: data.akashaId };
    }

    let profileId;
    let profile;
    let counter = 0;
    const results = [];
    const maxResults = (data.limit) ? data.limit : 10;
    if (!data.start) {
        profileId = yield contracts.instance.feed.getFollowingById(data.akashaId, currentId);
        profile = yield profileData.execute({ profile: profileId });
        results.push({ profile, address: profileId, index: currentId });
        counter = 1;
    }
    while (counter < maxResults) {
        currentId = yield contracts.instance.feed.getFollowingNext(data.akashaId, currentId);
        if (currentId === '0') {
            break;
        }
        profileId = yield contracts.instance.feed.getFollowingById(data.akashaId, currentId);
        profile = yield profileData.execute({ profile: profileId, short: data.short });
        results.push({ profile, address: profileId, index: currentId });
        counter++;
    }
    return { collection: results, akashaId: data.akashaId, limit: maxResults };
});

export default { execute, name: 'followingIterator' };

