"use strict";
const Promise = require("bluebird");
const index_1 = require("../../contracts/index");
const execute = Promise.coroutine(function* (data) {
    let currentId = (data.start) ? data.start : yield index_1.constructed.instance.subs.subsFirst(data.akashaId);
    if (currentId === '0') {
        return { collection: [], akashaId: data.akashaId };
    }
    let currentName;
    let counter = 0;
    const maxResults = (data.limit) ? data.limit : 10;
    const results = [];
    if (!data.start) {
        currentName = yield index_1.constructed.instance.tags.getTagName(currentId);
        results.push({ tagId: currentId, tagName: currentName });
        counter = 1;
    }
    while (counter < maxResults) {
        currentId = yield index_1.constructed.instance.subs.subsNext(data.akashaId, currentId);
        if (currentId === '0') {
            break;
        }
        currentName = yield index_1.constructed.instance.tags.getTagName(currentId);
        results.push({ tagId: currentId, tagName: currentName });
        counter++;
    }
    return { collection: results, akashaId: data.akashaId, limit: maxResults };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'tagSubIterator' };
//# sourceMappingURL=subs-iterator.js.map