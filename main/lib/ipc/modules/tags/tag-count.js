"use strict";
const Promise = require('bluebird');
const index_1 = require('../../contracts/index');
const execute = Promise.coroutine(function* () {
    const count = yield index_1.constructed.instance.tags.getTagsCount();
    return { count };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'getTagCount' };
//# sourceMappingURL=tag-count.js.map