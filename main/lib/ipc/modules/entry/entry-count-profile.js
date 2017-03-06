"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const index_1 = require("../../contracts/index");
const execute = Promise.coroutine(function* (data) {
    const count = yield index_1.constructed.instance.entries.getProfileEntriesCount(data.akashaId);
    return { count, akashaId: data.akashaId };
});
exports.default = { execute, name: 'getProfileEntriesCount' };
//# sourceMappingURL=entry-count-profile.js.map