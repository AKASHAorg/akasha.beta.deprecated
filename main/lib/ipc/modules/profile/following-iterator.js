"use strict";
const Promise = require("bluebird");
const index_1 = require("../../contracts/index");
const profile_data_1 = require("./profile-data");
const execute = Promise.coroutine(function* (data) {
    let currentId = (data.start) ? data.start : yield index_1.constructed.instance.feed.getFollowingFirst(data.akashaId);
    if (currentId === '0') {
        return { collection: [], akashaId: data.akashaId };
    }
    let profileId;
    let profile;
    let counter = 0;
    const results = [];
    const maxResults = (data.limit) ? data.limit : 10;
    if (!data.start) {
        profileId = yield index_1.constructed.instance.feed.getFollowingById(data.akashaId, currentId);
        profile = yield profile_data_1.default.execute({ profile: profileId });
        results.push({ profile, address: profileId, index: currentId });
        counter = 1;
    }
    while (counter < maxResults) {
        currentId = yield index_1.constructed.instance.feed.getFollowingNext(data.akashaId, currentId);
        if (currentId === '0') {
            break;
        }
        profileId = yield index_1.constructed.instance.feed.getFollowingById(data.akashaId, currentId);
        profile = yield profile_data_1.default.execute({ profile: profileId });
        results.push({ profile, address: profileId, index: currentId });
        counter++;
    }
    return { collection: results, akashaId: data.akashaId, limit: maxResults };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'followingIterator' };
//# sourceMappingURL=following-iterator.js.map