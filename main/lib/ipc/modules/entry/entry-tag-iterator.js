"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const index_1 = require("../../contracts/index");
const get_entry_1 = require("./get-entry");
const execute = Promise.coroutine(function* (data) {
    let currentId = (data.start) ? data.start : yield index_1.constructed.instance.entries.getTagEntryFirst(data.tagName);
    if (currentId === '0') {
        return { collection: [], tagName: data.tagName };
    }
    const maxResults = (data.limit) ? data.limit : 5;
    const fetchCalls = [];
    let counter = 0;
    if (!data.start) {
        fetchCalls.push(get_entry_1.default.execute({ entryId: currentId }));
        counter = 1;
    }
    while (counter < maxResults) {
        currentId = (data.reverse) ? yield index_1.constructed.instance.entries.getTagEntryPrev(data.tagName, currentId) :
            yield index_1.constructed.instance.entries.getTagEntryNext(data.tagName, currentId);
        if (currentId === '0') {
            break;
        }
        fetchCalls.push(get_entry_1.default.execute({ entryId: currentId }));
        counter++;
    }
    const results = yield Promise.all(fetchCalls);
    return { collection: results, tagName: data.tagName, limit: maxResults };
});
exports.default = { execute, name: 'entryTagIterator' };
//# sourceMappingURL=entry-tag-iterator.js.map