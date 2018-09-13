"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
const commentS = {
    id: '/comment',
    type: 'object',
    properties: {
        ethAddress: { type: 'string', format: 'address' },
        parent: { type: 'string' },
        entryId: { type: 'string' },
        token: { type: 'string' },
    },
    required: ['ethAddress', 'entryId', 'token'],
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data, cb) {
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, commentS, { throwError: true });
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        const ipfsHash = yield getService(constants_1.COMMENTS_MODULE.commentIpfs).create(data.content);
        const decodedHash = getService(constants_1.COMMON_MODULE.ipfsHelpers).decodeHash(ipfsHash);
        const replyTo = data.parent || '0';
        const txData = contracts.instance
            .Comments.publish.request(data.entryId, data.ethAddress, replyTo, ...decodedHash, { gas: 250000 });
        const transaction = yield contracts.send(txData, data.token, cb);
        let commentId = null;
        const receipt = transaction.receipt;
        if (receipt.logs && receipt.logs.length > 1) {
            const log = receipt.logs[receipt.logs.length - 1];
            commentId = log.topics.length > 3 ? log.data : null;
        }
        return { tx: transaction.tx, receipt: transaction.receipt, commentId, entryId: data.entryId };
    });
    const comment = { execute, name: 'comment', hasStream: true };
    const service = function () {
        return comment;
    };
    sp().service(constants_1.COMMENTS_MODULE.comment, service);
    return comment;
}
exports.default = init;
//# sourceMappingURL=add-comment.js.map