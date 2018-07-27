"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
exports.upvote = {
    id: '/upvote',
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
        v.validate(data, upvote, { throwError: true });
        if (data.weight < 1 || data.weight > 10) {
            throw new Error('Vote weight value must be between 1-10');
        }
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        const txData = contracts.instance.Votes
            .voteComment.request(data.weight, data.entryId, data.commentId, false, { gas: 300000 });
        const transaction = yield contracts.send(txData, data.token, cb);
        return { tx: transaction.tx, receipt: transaction.receipt };
    });
    const upvote = { execute, name: 'upvote', hasStream: true };
    const service = function () {
        return upvote;
    };
    sp().service(constants_1.COMMENTS_MODULE.upvote, service);
    return upvote;
}
exports.default = init;
//# sourceMappingURL=upvote-comment.js.map