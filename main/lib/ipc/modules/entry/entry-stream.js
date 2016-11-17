"use strict";
const Promise = require('bluebird');
const index_1 = require('../../contracts/index');
const following_count_1 = require('../profile/following-count');
const subs_count_1 = require('../tags/subs-count');
exports.DEFAULT_TAG = 'akasha';
const execute = Promise.coroutine(function* (data) {
    let fCount = yield following_count_1.default.execute({ akashaId: data.akashaId });
    let sCount = yield subs_count_1.default.execute({ akashaId: data.akashaId });
    const followedProfiles = [];
    const subbedTags = [];
    fCount = parseInt(fCount.count);
    sCount = parseInt(sCount.count);
    if (!fCount && !sCount) {
        return { profiles: [], tags: [{ tagName: exports.DEFAULT_TAG }], akashaId: data.akashaId };
    }
    let currentFollow = yield index_1.constructed.instance.feed.getFollowingFirst(data.akashaId);
    let profileAddress = yield index_1.constructed.instance.feed.getFollowingById(data.akashaId, currentFollow);
    let profileId = yield index_1.constructed.instance.profile.getId(profileAddress);
    followedProfiles.push({ profileAddress: profileAddress, akashaId: profileId });
    while (fCount > 1) {
        currentFollow = yield index_1.constructed.instance.feed.getFollowingNext(data.akashaId, currentFollow);
        profileAddress = yield index_1.constructed.instance.feed.getFollowingById(data.akashaId, currentFollow);
        profileId = yield index_1.constructed.instance.profile.getId(profileAddress);
        followedProfiles.push({ profileAddress: profileAddress, akashaId: profileId });
        fCount--;
    }
    let currentSub = yield index_1.constructed.instance.feed.subsFirst(data.akashaId);
    let tagName = yield index_1.constructed.instance.tags.getTagName(currentSub);
    if (!tagName) {
        subbedTags.push({ tagName: exports.DEFAULT_TAG, tagId: 'dont use :)' });
    }
    else {
        subbedTags.push({ tagId: currentSub, tagName: tagName });
    }
    while (sCount > 1) {
        currentSub = yield index_1.constructed.instance.feed.subsNext(data.akashaId, currentSub);
        tagName = yield index_1.constructed.instance.tags.getTagName(currentSub);
        subbedTags.push({ tagId: currentSub, tagName: tagName });
        sCount--;
    }
    return { profiles: followedProfiles, tags: subbedTags, akashaId: data.akashaId };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'getEntriesStream' };
//# sourceMappingURL=entry-stream.js.map