import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';
import followingCount from '../profile/following-count';
import subsCount from '../tags/subs-count';

export const DEFAULT_TAG = 'akasha';
/**
 * Get score of an entry
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: { akashaId: string }) {
    let fCount = yield followingCount.execute({ akashaId: data.akashaId });
    let sCount = yield subsCount.execute({ akashaId: data.akashaId });
    const followedProfiles = [];
    const subbedTags = [];
    fCount = parseInt(fCount);
    sCount = parseInt(sCount);
    if (!fCount && !sCount) {
        return { profiles: [], tags: [{ tagName: DEFAULT_TAG }], akashaId: data.akashaId };
    }
    let currentFollow = yield contracts.instance.feed.getFollowingFirst(data.akashaId);
    let profileId = yield contracts.instance.profile.getId(currentFollow);
    followedProfiles.push({ profileAddress: currentFollow, akashaId: profileId });
    while (fCount) {
        currentFollow = yield contracts.instance.feed.getFollowingNext(data.akashaId, currentFollow);
        profileId = yield contracts.instance.profile.getId(currentFollow);
        followedProfiles.push({ profileAddress: currentFollow, akashaId: profileId });
        fCount--;
    }

    let currentSub = yield contracts.instance.feed.subsFirst(data.akashaId);
    let tagName = yield contracts.instance.tags.getTagName(currentSub);
    subbedTags.push({ tagId: currentSub, tagName: tagName });
    while (sCount) {
        currentSub = yield contracts.instance.feed.subsNext(data.akashaId, currentSub);
        tagName = yield contracts.instance.tags.getTagName(currentSub);
        subbedTags.push({ tagId: currentSub, tagName: tagName });
        sCount--;
    }

    return { profiles: followedProfiles, tags: subbedTags, akashaId: data.akashaId };
});

export default { execute, name: 'getEntriesStream' };
