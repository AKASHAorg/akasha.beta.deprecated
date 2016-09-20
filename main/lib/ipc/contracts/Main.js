"use strict";
const BaseContract_1 = require('./BaseContract');
const Promise = require('bluebird');
class Main extends BaseContract_1.default {
    constructor(instance) {
        super();
        this.contract = Promise.promisifyAll(instance);
        this.contract.getVoteOf.callAsync = Promise.promisify(this.contract.getVoteOf.call);
        this.contract.openedToVotes.callAsync = Promise.promisify(this.contract.openedToVotes.call);
        this.contract.voteEndDate.callAsync = Promise.promisify(this.contract.voteEndDate.call);
        this.contract.getScoreOfEntry.callAsync = Promise.promisify(this.contract.getScoreOfEntry.call);
        this.contract.getFundsAddress.callAsync = Promise.promisify(this.contract.getFundsAddress.call);
        this.contract.getCommentsCount.callAsync = Promise.promisify(this.contract.getCommentsCount.call);
        this.contract.getCommentAt.callAsync = Promise.promisify(this.contract.getCommentAt.call);
        this.contract.getScoreOfComment.callAsync = Promise.promisify(this.contract.getScoreOfComment.call);
    }
    getVoteOf(profile, entryAddress) {
        return this.contract
            .getVoteOf
            .callAsync(profile, entryAddress);
    }
    openedToVotes(entryAddress) {
        return this.contract
            .openedToVotes
            .callAsync(entryAddress);
    }
    voteEndDate(entryAddress) {
        return this.contract
            .voteEndDate
            .callAsync(entryAddress);
    }
    getScoreOfEntry(entryAddress) {
        return this.contract
            .getScoreOfEntry
            .callAsync(entryAddress);
    }
    getFundsAddress() {
        return this.contract
            .getFundsAddress
            .callAsync();
    }
    getCommentsCount(entryAddress) {
        return this.contract
            .getCommentsCount
            .callAsync(entryAddress);
    }
    getCommentAt(entry, commentId) {
        const commentIdTr = this.gethInstance.web3.fromDecimal(commentId);
        return this.contract
            .getCommentAt
            .callAsync(entry, commentIdTr);
    }
    getScoreOfComment(entry, commentId) {
        const commentIdTr = this.gethInstance.web3.fromDecimal(commentId);
        return this.contract
            .getScoreOfComment
            .callAsync(entry, commentIdTr);
    }
    publishEntry(hash, tags, gas) {
        const hashTr = hash.map((v) => {
            return this.gethInstance.web3.fromUtf8(v);
        });
        const tagsTr = tags.map((v) => {
            return this.gethInstance.web3.fromUtf8(v);
        });
        return this.extractData('publishEntry', hashTr, tagsTr, { gas: gas });
    }
    updateEntry(hash, entryAddress, gas) {
        const hashTr = hash.map((v) => {
            return this.gethInstance.web3.fromUtf8(v);
        });
        return this.extractData('updateEntry', hashTr, entryAddress, { gas: gas });
    }
    upVoteEntry(entryAddress, weight, gas, value) {
        const weightTr = this.gethInstance.web3.fromDecimal(weight);
        return this.extractData('upVoteEntry', entryAddress, weightTr, { gas: gas, value: value });
    }
    downVoteEntry(entryAddress, weight, gas, value) {
        const weightTr = this.gethInstance.web3.fromDecimal(weight);
        return this.extractData('downVoteEntry', entryAddress, weightTr, { gas: gas, value: value });
    }
    saveComment(entryAddress, hash, gas) {
        const hashTr = hash.map((v) => {
            return this.gethInstance.web3.fromUtf8(v);
        });
        return this.extractData('saveComment', entryAddress, hashTr, { gas: gas });
    }
    updateComment(entryAddress, commentId, hash, gas) {
        const hashTr = hash.map((v) => {
            return this.gethInstance.web3.fromUtf8(v);
        });
        const commentIdTr = this.gethInstance.web3.fromDecimal(commentId);
        return this.extractData('updateCommententryAddress', commentIdTr, hashTr, { gas: gas });
    }
    upVoteComment(entryAddress, weigth, commentId, gas) {
        const weigthTr = this.gethInstance.web3.fromDecimal(weigth);
        const commentIdTr = this.gethInstance.web3.fromDecimal(commentId);
        return this.extractData('upVoteComment', entryAddress, weigthTr, commentIdTr, { gas: gas });
    }
    downVoteComment(entryAddress, weigth, commentId, gas) {
        const weigthTr = this.gethInstance.web3.fromDecimal(weigth);
        const commentIdTr = this.gethInstance.web3.fromDecimal(commentId);
        return this.extractData('downVoteCommentAsync', entryAddress, weigthTr, commentIdTr, { gas: gas });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Main;
//# sourceMappingURL=Main.js.map