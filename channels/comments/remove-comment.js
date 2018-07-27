"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
const removeCommentS = {
    id: '/removeComment',
    type: 'object',
    properties: {
        ethAddress: { type: 'string', format: 'address' },
        commentId: { type: 'string' },
        entryId: { type: 'string' },
        token: { type: 'string' },
    },
    required: ['ethAddress', 'entryId', 'token', 'commentId'],
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data, cb) {
        const v = new getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA).Validator();
        v.validate(data, removeCommentS, { throwError: true });
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        const txData = yield contracts.instance.Comments
            .deleteComment.request(data.entryId, data.ethAddress, data.commentId, { gas: 250000 });
        const transaction = yield contracts.send(txData, data.token, cb);
        return { tx: transaction.tx, receipt: transaction.receipt };
    });
    const removeComment = { execute, name: 'removeComment', hasStream: true };
    const service = function () {
        return removeComment;
    };
    sp().service(constants_1.COMMENTS_MODULE.removeComment, service);
    return removeComment;
}
exports.default = init;
//# sourceMappingURL=remove-comment.js.map