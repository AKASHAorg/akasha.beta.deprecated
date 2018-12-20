"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
function init(sp, getService) {
    const create = function create(data) {
        const date = (new Date()).toJSON();
        const constructed = {
            date,
            content: data,
        };
        return (getService(constants_1.CORE_MODULE.IPFS_CONNECTOR)).getInstance().api
            .add(constructed)
            .then((result) => result.hash);
    };
    const getCommentContent = function getCommentContent(hash) {
        const comments = (getService(constants_1.CORE_MODULE.STASH)).comments;
        if (comments.hasFull(hash)) {
            return Promise.resolve(comments.getFull(hash));
        }
        return (getService(constants_1.CORE_MODULE.IPFS_CONNECTOR)).getInstance().api
            .get(hash)
            .timeout((getService(constants_1.CORE_MODULE.SETTINGS)).get(constants_1.GENERAL_SETTINGS.FULL_WAIT_TIME))
            .then((data) => {
            comments.setFull(hash, data);
            return data;
        }).catch((e) => {
            return { content: null };
        });
    };
    const commentIpfs = { create, getCommentContent };
    const service = function () {
        return commentIpfs;
    };
    sp().service(constants_1.COMMENTS_MODULE.commentIpfs, service);
}
exports.default = init;
//# sourceMappingURL=ipfs.js.map