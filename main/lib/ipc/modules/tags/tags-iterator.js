"use strict";
const Promise = require("bluebird");
const index_1 = require("../../contracts/index");
const execute = Promise.coroutine(function* (data) {
    let currentId = (data.start) ? data.start : yield index_1.constructed.instance.tags.getFirstTag();
    if (currentId === '0') {
        return { collection: [] };
    }
    let currentName;
    const maxResults = (data.limit) ? data.limit : 20;
    const results = [];
    let counter = 0;
    if (!data.start) {
        currentName = yield index_1.constructed.instance.tags.getTagName(currentId);
        results.push({ tagId: currentId, tagName: currentName });
        counter = 1;
    }
    while (counter < maxResults) {
        currentId = yield index_1.constructed.instance.tags.getNextTag(currentId);
        if (currentId === '0') {
            break;
        }
        currentName = yield index_1.constructed.instance.tags.getTagName(currentId);
        results.push({ tagId: currentId, tagName: currentName });
        counter++;
    }
    return { collection: results, limit: maxResults };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'tagIterator' };
//# sourceMappingURL=tags-iterator.js.map