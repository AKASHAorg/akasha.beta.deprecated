"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const index_1 = require("../../contracts/index");
const execute = Promise.coroutine(function* (data) {
    const count = yield index_1.constructed.instance.feed.isFollower(data.akashaId, data.following);
    return { count, following: data.following, akashaId: data.akashaId };
});
exports.default = { execute, name: 'isFollower' };
//# sourceMappingURL=is-follower.js.map