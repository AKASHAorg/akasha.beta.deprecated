"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseContract_1 = require("./BaseContract");
const Promise = require("bluebird");
class Comments extends BaseContract_1.default {
    constructor(instance) {
        super();
        this.contract = instance;
        this.contract.getCommentsCount.callAsync = Promise.promisify(this.contract.getCommentsCount.call);
        this.contract.getComment.callAsync = Promise.promisify(this.contract.getComment.call);
        this.contract.getFirstComment.callAsync = Promise.promisify(this.contract.getFirstComment.call);
        this.contract.getLastComment.callAsync = Promise.promisify(this.contract.getLastComment.call);
        this.contract.getNextComment.callAsync = Promise.promisify(this.contract.getNextComment.call);
        this.contract.getPrevComment.callAsync = Promise.promisify(this.contract.getPrevComment.call);
    }
    comment(entryId, hash, gas = 2000000, parent) {
        const hashTr = this.splitIpfs(hash);
        return this.evaluateData('comment', gas, entryId, hashTr, parent);
    }
    removeComment(entryId, commentId, gas = 2000000) {
        return this.evaluateData('removeComment', gas, entryId, commentId);
    }
    getComment(entryId, commentId) {
        return this.contract
            .getComment
            .callAsync(entryId, commentId)
            .then((result) => {
            return {
                profile: result[0],
                idComment: (result[1]).toString(),
                parent: (result[2]).toString(),
                ipfsHash: this.flattenIpfs(result[3]),
                active: !(result[4]),
                unixStamp: (result[5]).toNumber()
            };
        });
    }
    getCommentsCount(entryId) {
        return this.contract
            .getCommentsCount
            .callAsync(entryId)
            .then((result) => result.toNumber());
    }
    getFirstComment(entryId) {
        return this.contract
            .getFirstComment
            .callAsync(entryId)
            .then((result) => result.toString());
    }
    getLastComment(entryId) {
        return this.contract
            .getLastComment
            .callAsync(entryId)
            .then((result) => result.toString());
    }
    getNextComment(entryId, commentId) {
        return this.contract
            .getNextComment
            .callAsync(entryId, commentId)
            .then((result) => result.toString());
    }
    getPrevComment(entryId, commentId) {
        return this.contract
            .getPrevComment
            .callAsync(entryId, commentId)
            .then((result) => result.toString());
    }
}
exports.default = Comments;
//# sourceMappingURL=Comments.js.map