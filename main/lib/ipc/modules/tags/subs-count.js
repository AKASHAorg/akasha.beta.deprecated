"use strict";
const Promise = require('bluebird');
const index_1 = require('../../contracts/index');
const execute = Promise.coroutine(function* (data) {
    const count = yield index_1.constructed.instance.feed.subsCount(data.profileAddress);
    return { count, profileAddress: data.profileAddress };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'subsCount' };
//# sourceMappingURL=subs-count.js.map