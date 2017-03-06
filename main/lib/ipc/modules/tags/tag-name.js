"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const index_1 = require("../../contracts/index");
const execute = Promise.coroutine(function* (data) {
    const tagName = yield index_1.constructed.instance.tags.getTagName(data.tagId);
    return { tagName, tagId: data.tagId };
});
exports.default = { execute, name: 'getTagName' };
//# sourceMappingURL=tag-name.js.map