"use strict";
const Promise = require("bluebird");
const index_1 = require("../../contracts/index");
const execute = Promise.coroutine(function* (data) {
    const exists = yield index_1.constructed.instance.tags.exists(data.tagName);
    return { exists, tagName: data.tagName };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'exists' };
//# sourceMappingURL=exists-tag.js.map