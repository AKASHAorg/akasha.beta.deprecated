"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const downvote_entry_1 = require("./downvote-entry");
const constants_1 = require("@akashaproject/common/constants");
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data, cb) {
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, downvote_entry_1.downvote, { throwError: true });
        if (data.weight < 1 || data.weight > 10) {
            throw new Error('Vote weight value must be between 1-10');
        }
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        const txData = contracts.instance.Votes.voteEntry
            .request(data.weight, data.entryId, false, data.ethAddress, { gas: 250000 });
        const transaction = yield contracts.send(txData, data.token, cb);
        return { tx: transaction.tx, receipt: transaction.receipt };
    });
    const upVote = { execute, name: 'upvote', hasStream: true };
    const service = function () {
        return upVote;
    };
    sp().service(constants_1.ENTRY_MODULE.upVote, service);
    return upVote;
}
exports.default = init;
//# sourceMappingURL=upvote-entry.js.map