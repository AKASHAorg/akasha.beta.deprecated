"use strict";
const Promise = require('bluebird');
const index_1 = require('../../contracts/index');
const execute = Promise.coroutine(function* (data) {
    if (!data.limit) {
        data.limit = 1;
    }
    let currentId = yield index_1.constructed.instance.tags.getFirstTag();
    let currentName = yield index_1.constructed.instance.tags.getTagName(currentId);
    const results = [];
    if (currentName.includes(data.tagName)) {
        results.push(currentName);
    }
    while (results.length < data.limit) {
        currentId = yield index_1.constructed.instance.tags.getNextTag(currentId);
        if (currentId === '0') {
            break;
        }
        let currentName = yield index_1.constructed.instance.tags.getTagName(currentId);
        if (currentName.includes(data.tagName)) {
            results.push(currentName);
        }
    }
    return { collection: results, tagName: data.tagName };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'searchTag' };
//# sourceMappingURL=search-tag.js.map