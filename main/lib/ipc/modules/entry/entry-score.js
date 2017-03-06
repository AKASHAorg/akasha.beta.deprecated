"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const index_1 = require("../../contracts/index");
const execute = Promise.coroutine(function* (data) {
    const score = yield index_1.constructed.instance.votes.getScore(data.entryId);
    return { score, entryId: data.entryId };
});
exports.default = { execute, name: 'getScore' };
//# sourceMappingURL=entry-score.js.map