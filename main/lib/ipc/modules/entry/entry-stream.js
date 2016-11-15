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
    fCount = parseInt(fCount);
    sCount = parseInt(sCount);
    if (!fCount && !sCount) {
        return { profiles: [], tags: [{ tagName: exports.DEFAULT_TAG }], akashaId: data.akashaId };
    }
    let currentFollow = yield index_1.constructed.instance.feed.getFollowingFirst(data.akashaId);
    let profileId = yield index_1.constructed.instance.profile.getId(currentFollow);
    followedProfiles.push({ profileAddress: currentFollow, akashaId: profileId });
    while (fCount) {
        currentFollow = yield index_1.constructed.instance.feed.getFollowingNext(data.akashaId, currentFollow);
        profileId = yield index_1.constructed.instance.profile.getId(currentFollow);
        followedProfiles.push({ profileAddress: currentFollow, akashaId: profileId });
        fCount--;
    }
    let currentSub = yield index_1.constructed.instance.feed.subsFirst(data.akashaId);
    let tagName = yield index_1.constructed.instance.tags.getTagName(currentSub);
    subbedTags.push({ tagId: currentSub, tagName: tagName });
    while (sCount) {
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