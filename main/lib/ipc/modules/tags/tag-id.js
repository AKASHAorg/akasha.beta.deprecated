"use strict";
const Promise = require("bluebird");
const index_1 = require("../../contracts/index");
const execute = Promise.coroutine(function* (data) {
    const tagId = yield index_1.constructed.instance.tags.getTagId(data.tagName);
    return { tagId, tagName: data.tagName };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'getTagId' };
//# sourceMappingURL=tag-id.js.map