"use strict";
const Promise = require("bluebird");
const index_1 = require("../../contracts/index");
const execute = Promise.coroutine(function* (data) {
    const count = yield index_1.constructed.instance.feed.isFollowing(data.follower, data.akashaId);
    return { count, follower: data.follower, akashaId: data.akashaId };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'isFollowing' };
//# sourceMappingURL=is-following.js.map