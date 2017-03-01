"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const index_1 = require("../../contracts/index");
const execute = Promise.coroutine(function* (data) {
    const count = yield index_1.constructed.instance.feed.getFollowingCount(data.akashaId);
    return { count, akashaId: data.akashaId };
});
exports.default = { execute, name: 'getFollowingCount' };
//# sourceMappingURL=following-count.js.map