"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
const claimVoteS = {
    id: '/claimVote',
    type: 'object',
    properties: {
        entryId: { type: 'string' },
        token: { type: 'string' },
    },
    required: ['entryId', 'token'],
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data, cb) {
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, claimVoteS, { throwError: true });
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        const txData = contracts.instance.Votes.claimKarmaVote.request(data.entryId, { gas: 200000 });
        const transaction = yield contracts.send(txData, data.token, cb);
        return { tx: transaction.tx, receipt: transaction.receipt };
    });
    const claimVote = { execute, name: 'claimVote', hasStream: true };
    const service = function () {
        return claimVote;
    };
    sp().service(constants_1.ENTRY_MODULE.claimVote, service);
    return claimVote;
}
exports.default = init;
//# sourceMappingURL=claim-vote.js.map