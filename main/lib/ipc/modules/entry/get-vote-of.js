"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const index_1 = require("../../contracts/index");
const execute = Promise.coroutine(function* (data) {
    const profileAddress = yield index_1.constructed.instance.registry.addressOf(data.akashaId);
    const weight = yield index_1.constructed.instance.votes.getVoteOfProfile(data.entryId, profileAddress);
    return { weight, entryId: data.entryId, akashaId: data.akashaId };
});
exports.default = { execute, name: 'getVoteOf' };
//# sourceMappingURL=get-vote-of.js.map