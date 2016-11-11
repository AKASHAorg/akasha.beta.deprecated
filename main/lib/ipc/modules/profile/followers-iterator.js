"use strict";
const Promise = require('bluebird');
const index_1 = require('../../contracts/index');
const profile_data_1 = require('./profile-data');
const execute = Promise.coroutine(function* (data) {
    let currentId = (data.start) ? data.start : yield index_1.constructed.instance.feed.getFollowersFirst(data.akashaId);
    if (currentId === '0') {
        return { collection: [], akashaId: data.akashaId };
    }
    let profileId = yield index_1.constructed.instance.feed.getFollowersById(data.akashaId, currentId);
    let profile = yield profile_data_1.default.execute({ profile: profileId });
    const maxResults = (data.limit) ? data.limit : 10;
    const results = [{ profile, address: profileId }];
    let counter = 1;
    while (counter < maxResults) {
        currentId = yield index_1.constructed.instance.feed.getFollowersNext(data.akashaId, currentId);
        if (currentId === '0') {
            break;
        }
        profileId = yield index_1.constructed.instance.feed.getFollowersById(data.akashaId, currentId);
        profile = yield profile_data_1.default.execute({ profile: profileId });
        results.push({ profile, address: profileId });
        counter++;
    }
    return { collection: results, akashaId: data.akashaId };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'followersIterator' };
//# sourceMappingURL=followers-iterator.js.map