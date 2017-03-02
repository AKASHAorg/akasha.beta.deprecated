"use strict";
const Promise = require("bluebird");
const index_1 = require("../../contracts/index");
const execute = Promise.coroutine(function* (data) {
    let currentId = yield index_1.constructed.instance.feed.getFollowingFirst(data.akashaId);
    if (currentId === '0') {
        return { collection: [], akashaId: data.akashaId };
    }
    let profileId;
    const results = [];
    profileId = yield index_1.constructed.instance.feed.getFollowingById(data.akashaId, currentId);
    results.push(profileId);
    while (currentId !== '0') {
        currentId = yield index_1.constructed.instance.feed.getFollowingNext(data.akashaId, currentId);
        if (currentId === '0') {
            break;
        }
        profileId = yield index_1.constructed.instance.feed.getFollowingById(data.akashaId, currentId);
        results.push(profileId);
    }
    return { collection: results, akashaId: data.akashaId };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'getFollowingList' };
//# sourceMappingURL=following-list.js.map