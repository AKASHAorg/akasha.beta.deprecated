"use strict";
const Promise = require('bluebird');
const index_1 = require('../../contracts/index');
const execute = Promise.coroutine(function* (data) {
    const count = yield index_1.constructed.instance.entries.getTagEntriesCount(data.tagName);
    return { count, tagName: data.tagName };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'getTagEntriesCount' };
//# sourceMappingURL=entry-count-tag.js.map