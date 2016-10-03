"use strict";
const BaseContract_1 = require('./BaseContract');
const Promise = require('bluebird');
class Main extends BaseContract_1.default {
    constructor(instance) {
        super();
        this.contract = Promise.promisifyAll(instance);
        this.contract.getEntry.callAsync = Promise.promisify(this.contract.getEntry.call);
        this.contract.getEntriesCount.callAsync = Promise.promisify(this.contract.getEntriesCount.call);
        this.contract.getEntryOf.callAsync = Promise.promisify(this.contract.getEntryOf.call);
        this.contract.getFollowingCount.callAsync = Promise.promisify(this.contract.getFollowingCount.call);
        this.contract.getFollowersCount.callAsync = Promise.promisify(this.contract.getFollowersCount.call);
        this.contract.getFollowingAt.callAsync = Promise.promisify(this.contract.getFollowingAt.call);
        this.contract.getFollowerAt.callAsync = Promise.promisify(this.contract.getFollowerAt.call);
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
    getEntry(address) {
        return this.contract
            .getEntry
            .callAsync(address);
    }
    follow(address, gas) {
        return this.extractData('follow', address, { gas });
    }
    getFollowingCount(address) {
        return this.contract
            .getFollowingCount
            .callAsync(address);
    }
    getEntriesCount(address) {
        return this.contract
            .getEntriesCount
            .callAsync(address);
    }
    getEntryOf(address, position) {
        return this.contract
            .getEntryOf
            .callAsync(address, position);
    }
    getFollowersCount(address) {
        return this.contract
            .getFollowersCount
            .callAsync(address);
    }
    getCommentsCount(entryAddress) {
        return this.contract
            .getCommentsCount
            .callAsync(entryAddress);
    }
    getFollowingAt(address, position) {
        return this.contract
            .getFollowingAt
            .callAsync(address, position);
    }
    getFollowerAt(address, position) {
        return this.contract
            .getFollowerAt
            .callAsync(address, position);
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
        return this.extractData('publishEntry', hashTr, tagsTr, { gas });
    }
    updateEntry(hash, entryAddress, gas) {
        const hashTr = hash.map((v) => {
            return this.gethInstance.web3.fromUtf8(v);
        });
        return this.extractData('updateEntry', hashTr, entryAddress, { gas });
    }
    upVoteEntry(entryAddress, weight, gas, value) {
        const weightTr = this.gethInstance.web3.fromDecimal(weight);
        return this.extractData('upVoteEntry', entryAddress, weightTr, { gas, value });
    }
    downVoteEntry(entryAddress, weight, gas, value) {
        const weightTr = this.gethInstance.web3.fromDecimal(weight);
        return this.extractData('downVoteEntry', entryAddress, weightTr, { gas, value });
    }
    saveComment(entryAddress, hash, gas) {
        const hashTr = hash.map((v) => {
            return this.gethInstance.web3.fromUtf8(v);
        });
        return this.extractData('saveComment', entryAddress, hashTr, { gas });
    }
    updateComment(entryAddress, commentId, hash, gas) {
        const hashTr = hash.map((v) => {
            return this.gethInstance.web3.fromUtf8(v);
        });
        const commentIdTr = this.gethInstance.web3.fromDecimal(commentId);
        return this.extractData('updateComment', entryAddress, commentIdTr, hashTr, { gas });
    }
    upVoteComment(entryAddress, weigth, commentId, gas, value) {
        const weigthTr = this.gethInstance.web3.fromDecimal(weigth);
        const commentIdTr = this.gethInstance.web3.fromDecimal(commentId);
        return this.extractData('upVoteComment', entryAddress, weigthTr, commentIdTr, {
            gas,
            value
        });
    }
    downVoteComment(entryAddress, weigth, commentId, gas, value) {
        const weigthTr = this.gethInstance.web3.fromDecimal(weigth);
        const commentIdTr = this.gethInstance.web3.fromDecimal(commentId);
        return this.extractData('downVoteCommentAsync', entryAddress, weigthTr, commentIdTr, {
            gas,
            value
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Main;
//# sourceMappingURL=Main.js.map