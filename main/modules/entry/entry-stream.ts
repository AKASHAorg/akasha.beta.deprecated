import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import followingCount from '../profile/following-count';
import subsCount from '../tags/subs-count';

export const DEFAULT_TAG = 'akasha';
/**
 * Get score of an entry
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: { akashaId: string }) {
    let fCount = yield followingCount.execute({ akashaId: data.akashaId });
    let sCount = yield subsCount.execute({ akashaId: data.akashaId });
    const followedProfiles = [];
    const subbedTags = [];
    fCount = parseInt(fCount.count);
    sCount = parseInt(sCount.count);
    if (!fCount && !sCount) {
        return { profiles: [], tags: [{ tagName: DEFAULT_TAG }], akashaId: data.akashaId };
    }
    let currentFollow = yield contracts.instance.feed.getFollowingFirst(data.akashaId);
    let profileAddress = yield contracts.instance.feed.getFollowingById(data.akashaId, currentFollow);
    let profileId = yield contracts.instance.profile.getId(profileAddress);

    followedProfiles.push({ profileAddress: profileAddress, akashaId: profileId });
    while (fCount > 1) {
        currentFollow = yield contracts.instance.feed.getFollowingNext(data.akashaId, currentFollow);
        profileAddress = yield contracts.instance.feed.getFollowingById(data.akashaId, currentFollow);
        profileId = yield contracts.instance.profile.getId(profileAddress);
        followedProfiles.push({ profileAddress: profileAddress, akashaId: profileId });
        fCount--;
    }

    let currentSub = yield contracts.instance.subs.subsFirst(data.akashaId);
    let tagName = yield contracts.instance.tags.getTagName(currentSub);
    if (!tagName) {
        subbedTags.push({ tagName: DEFAULT_TAG, tagId: 'dont use :)' });
    } else {
        subbedTags.push({ tagId: currentSub, tagName: tagName });
    }

    while (sCount > 1) {
        currentSub = yield contracts.instance.subs.subsNext(data.akashaId, currentSub);
        tagName = yield contracts.instance.tags.getTagName(currentSub);
        subbedTags.push({ tagId: currentSub, tagName: tagName });
        sCount--;
    }

    return { profiles: followedProfiles, tags: subbedTags, akashaId: data.akashaId };
});

export default { execute, name: 'getEntriesStream' };
