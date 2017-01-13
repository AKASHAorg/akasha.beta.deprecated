"use strict";
const Promise = require('bluebird');
const index_1 = require('../../contracts/index');
const get_entry_1 = require('./get-entry');
const execute = Promise.coroutine(function* (data) {
    let currentId = (data.start) ? data.start : yield index_1.constructed.instance.entries.getProfileEntryFirst(data.akashaId);
    if (currentId === '0') {
        return { collection: [], akashaId: data.akashaId };
    }
    const maxResults = (data.limit) ? data.limit : 5;
    const fetchCalls = [];
    let counter = 0;
    if (!data.start) {
        fetchCalls.push(get_entry_1.default.execute({ entryId: currentId }));
        counter = 1;
    }
    while (counter < maxResults) {
        currentId = yield index_1.constructed.instance.entries.getProfileEntryNext(data.akashaId, currentId);
        if (currentId === '0') {
            break;
        }
        fetchCalls.push(get_entry_1.default.execute({ entryId: currentId }));
        counter++;
    }
    const results = yield Promise.all(fetchCalls);
    return { collection: results, akashaId: data.akashaId, limit: maxResults };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'entryProfileIterator' };
//# sourceMappingURL=entry-profile-iterator.js.map