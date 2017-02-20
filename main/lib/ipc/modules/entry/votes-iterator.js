"use strict";
const Promise = require("bluebird");
const index_1 = require("../../contracts/index");
const execute = Promise.coroutine(function* (data) {
    let currentId = (data.start) ? data.start : yield index_1.constructed.instance.votes.getFirstVoteId(data.entryId);
    if (currentId === '0') {
        return { collection: [] };
    }
    let row;
    let akashaId;
    const maxResults = (data.limit) ? data.limit : 100;
    const results = [];
    let counter = 0;
    if (!data.start) {
        row = yield index_1.constructed.instance.votes.getVoteOf(data.entryId, currentId);
        akashaId = yield index_1.constructed.instance.profile.getId(row.profile);
        results.push({ akashaId: akashaId, profileAddress: row.profile, score: row.score });
        counter = 1;
    }
    while (counter < maxResults) {
        currentId = yield index_1.constructed.instance.votes.getNextVoteId(data.entryId, currentId);
        if (currentId === '0') {
            break;
        }
        row = yield index_1.constructed.instance.votes.getVoteOf(data.entryId, currentId);
        akashaId = yield index_1.constructed.instance.profile.getId(row.profile);
        results.push({ akashaId: akashaId, profileAddress: row.profile, score: row.score });
        counter++;
    }
    return { collection: results, entryId: data.entryId, limit: maxResults };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'votesIterator' };
//# sourceMappingURL=votes-iterator.js.map