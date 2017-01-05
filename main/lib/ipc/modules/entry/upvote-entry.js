"use strict";
const index_1 = require('../auth/index');
const Promise = require('bluebird');
const index_2 = require('../../contracts/index');
const runner_1 = require('../pinner/runner');
const execute = Promise.coroutine(function* (data) {
    if (data.weight < 1 || data.weight > 10) {
        throw new Error("Vote weight value must be between 1-10");
    }
    const txData = yield index_2.constructed.instance.votes.upvote(data.entryId, data.weight, data.value, data.gas);
    const tx = yield index_1.module.auth.signData(txData, data.token);
    runner_1.default.execute({ type: runner_1.ObjectType.ENTRY, id: data.entryId, operation: runner_1.OperationType.ADD });
    return { tx, entryId: data.entryId, extra: data.extra };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'upvote' };
//# sourceMappingURL=upvote-entry.js.map