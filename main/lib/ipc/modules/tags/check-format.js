"use strict";
const Promise = require("bluebird");
const index_1 = require("../../contracts/index");
const execute = Promise.coroutine(function* (data) {
    const status = yield index_1.constructed.instance.tags.checkFormat(data.tagName);
    return { status, tagName: data.tagName };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'checkFormat' };
//# sourceMappingURL=check-format.js.map