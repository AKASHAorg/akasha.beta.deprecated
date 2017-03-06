"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const index_1 = require("../../contracts/index");
const execute = Promise.coroutine(function* (data) {
    const count = yield index_1.constructed.instance.votes.getVotesCount(data.entryId);
    return { count, entryId: data.entryId };
});
exports.default = { execute, name: 'voteCount' };
//# sourceMappingURL=vote-count.js.map