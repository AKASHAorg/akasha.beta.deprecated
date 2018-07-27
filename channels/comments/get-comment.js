"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const ethereumjs_util_1 = require("ethereumjs-util");
const constants_1 = require("@akashaproject/common/constants");
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        const [parent, ethAddress, deleted, publishDate, fn, digestSize, hash] = yield contracts.instance
            .Comments.getComment(data.entryId, data.commentId);
        const ipfsHash = getService(constants_1.COMMON_MODULE.ipfsHelpers).encodeHash(fn, digestSize, hash);
        const author = yield getService(constants_1.PROFILE_MODULE.resolveEthAddress).execute({ ethAddress });
        const content = data.noResolve ?
            { ipfsHash } : yield getService(constants_1.COMMENTS_MODULE.commentIpfs).getCommentContent(ipfsHash);
        const [totalVotes, score, endPeriod] = yield contracts
            .instance.Votes.getRecord(data.commentId);
        return Object.assign({}, content, {
            parent: (!!ethereumjs_util_1.unpad(parent)) ? parent : null,
            author,
            deleted,
            totalVotes: totalVotes.toNumber(),
            score: score.toNumber(),
            endPeriod: endPeriod.toNumber(),
            publishDate: publishDate.toNumber(),
        });
    });
    const getComment = { execute, name: 'getComment' };
    const service = function () {
        return getComment;
    };
    sp().service(constants_1.COMMENTS_MODULE.getComment, service);
    return getComment;
}
exports.default = init;
//# sourceMappingURL=get-comment.js.map