"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
exports.downvote = {
    id: '/downvote',
    type: 'object',
    properties: {
        entryId: { type: 'string' },
        token: { type: 'string' },
        commentId: { type: 'string' },
        weight: { type: 'number' },
    },
    required: ['entryId', 'token', 'commentId', 'weight'],
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data, cb) {
        const v = new getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA).Validator();
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        v.validate(data, exports.downvote, { throwError: true });
        if (data.weight < 1 || data.weight > 10) {
            throw new Error('Vote weight value must be between 1-10');
        }
        const txData = contracts.instance
            .Votes.voteComment
            .request(data.weight, data.entryId, data.commentId, true, { gas: 250000 });
        const transaction = yield contracts.send(txData, data.token, cb);
        return { tx: transaction.tx, receipt: transaction.receipt };
    });
    const downVote = { execute, name: 'downvote', hasStream: true };
    const service = function () {
        return downVote;
    };
    sp().service(constants_1.COMMENTS_MODULE.downVote, service);
    return downVote;
}
exports.default = init;
//# sourceMappingURL=downvote-comment.js.map