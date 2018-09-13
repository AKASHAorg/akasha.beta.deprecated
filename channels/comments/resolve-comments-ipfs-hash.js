"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
const resolveCommentsIpfsHashS = {
    id: '/resolveCommentsIpfsHash',
    type: 'array',
    items: {
        type: 'string',
        format: 'multihash',
    },
    uniqueItems: true,
    minItems: 1,
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data, cb) {
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, resolveCommentsIpfsHashS, { throwError: true });
        const getCommentContent = getService(constants_1.COMMENTS_MODULE.commentIpfs).getCommentContent;
        for (const ipfsHash of data) {
            getCommentContent(ipfsHash)
                .then((result) => cb('', Object.assign({}, result, { ipfsHash })));
        }
        return {};
    });
    const resolveCommentsIpfsHash = { execute, name: 'resolveCommentsIpfsHash', hasStream: true };
    const service = function () {
        return resolveCommentsIpfsHash;
    };
    sp().service(constants_1.COMMENTS_MODULE.resolveCommentsIpfsHash, service);
    return resolveCommentsIpfsHash;
}
exports.default = init;
//# sourceMappingURL=resolve-comments-ipfs-hash.js.map