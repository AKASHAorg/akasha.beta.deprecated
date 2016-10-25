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
            .callAsync(profile, entryAddress)
            .then((voteCount) => voteCount.toString(10));
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
            .callAsync(entryAddress)
            .then((score) => score.toString(10));
    }
    getFundsAddress() {
        return this.contract
            .getFundsAddress
            .callAsync();
    }
    getEntry(address) {
        return this.contract
            .getEntry
            .callAsync(address)
            .then((data) => {
            return Promise.resolve({
                date: data[0].toString(),
                profile: data[1],
                ipfsHash: this.flattenIpfs(data[2])
            });
        });
    }
    follow(address, gas) {
        return Promise.resolve(this.extractData('follow', address, { gas }));
    }
    getFollowingCount(address) {
        return this.contract
            .getFollowingCount
            .callAsync(address)
            .then((count) => count.toString());
    }
    getEntriesCount(address) {
        return this.contract
            .getEntriesCount
            .callAsync(address)
            .then((count) => count.toString());
    }
    getEntryOf(address, position) {
        return this.contract
            .getEntryOf
            .callAsync(address, position)
            .then((data) => {
            return Promise.resolve({
                date: data[0].toString(),
                profile: data[1],
                ipfsHash: this.flattenIpfs(data[2])
            });
        });
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
        const tagsTr = tags.map((v) => {
            return this.gethInstance.web3.fromUtf8(v);
        });
        return Promise.resolve(this.extractData('publishEntry', this.splitIpfs(hash), tagsTr, { gas }));
    }
    updateEntry(hash, entryAddress, gas) {
        const hashTr = hash.map((v) => {
            return this.gethInstance.web3.fromUtf8(v);
        });
        return Promise.resolve(this.extractData('updateEntry', hashTr, entryAddress, { gas }));
    }
    upVoteEntry(entryAddress, weight, gas, value) {
        if (weight < 1 || weight > 10) {
            return Promise.reject('weight should be between 1-10');
        }
        const cost = this.gethInstance.web3.toWei(weight * weight, 'finney');
        if (value) {
            value = this.gethInstance.web3.toWei(value, 'ether');
            if (cost > value) {
                return Promise.reject(`value sent: ${value} wei is lower than min cost: ${cost} wei`);
            }
        }
        return Promise.resolve(this.extractData('upVoteEntry', entryAddress, weight, {
            gas,
            value: (value) ? value : cost
        }));
    }
    downVoteEntry(entryAddress, weight, gas, value) {
        if (weight < 1 || weight > 10) {
            return Promise.reject('weight should be between 1-10');
        }
        const cost = this.gethInstance.web3.toWei(weight * weight, 'finney');
        if (value) {
            value = this.gethInstance.web3.toWei(value, 'ether');
            if (cost > value) {
                return Promise.reject(`value sent: ${value} wei is lower than min cost: ${cost} wei`);
            }
        }
        return Promise.resolve(this.extractData('downVoteEntry', entryAddress, weight, {
            gas,
            value: (value) ? value : cost
        }));
    }
    saveComment(entryAddress, hash, gas) {
        const hashTr = hash.map((v) => {
            return this.gethInstance.web3.fromUtf8(v);
        });
        return Promise.resolve(this.extractData('saveComment', entryAddress, hashTr, { gas }));
    }
    updateComment(entryAddress, commentId, hash, gas) {
        const hashTr = hash.map((v) => {
            return this.gethInstance.web3.fromUtf8(v);
        });
        const commentIdTr = this.gethInstance.web3.fromDecimal(commentId);
        return Promise.resolve(this.extractData('updateComment', entryAddress, commentIdTr, hashTr, { gas }));
    }
    upVoteComment(entryAddress, weigth, commentId, gas, value) {
        const weigthTr = this.gethInstance.web3.fromDecimal(weigth);
        const commentIdTr = this.gethInstance.web3.fromDecimal(commentId);
        return Promise.resolve(this.extractData('upVoteComment', entryAddress, weigthTr, commentIdTr, {
            gas,
            value
        }));
    }
    downVoteComment(entryAddress, weigth, commentId, gas, value) {
        const weigthTr = this.gethInstance.web3.fromDecimal(weigth);
        const commentIdTr = this.gethInstance.web3.fromDecimal(commentId);
        return Promise.resolve(this.extractData('downVoteCommentAsync', entryAddress, weigthTr, commentIdTr, {
            gas,
            value
        }));
    }
    getEntriesCreatedEvent(filter) {
        const { fromBlock, toBlock, address } = filter;
        const EntriesCreated = this.contract.Published(filter.index, { fromBlock, toBlock, address });
        EntriesCreated.getAsync = Promise.promisify(EntriesCreated.get);
        return EntriesCreated.getAsync();
    }
    getCommentsOfEvent(filter) {
        const { fromBlock, toBlock, address } = filter;
        const CommentsOf = this.contract.Commented(filter.index, { fromBlock, toBlock, address });
        CommentsOf.getAsync = Promise.promisify(CommentsOf.get);
        return CommentsOf.getAsync();
    }
    getVotesOfEvent(filter) {
        const { fromBlock, toBlock, address } = filter;
        const VotesOf = this.contract.Voted(filter.index, { fromBlock, toBlock, address });
        VotesOf.getAsync = Promise.promisify(VotesOf.get);
        return VotesOf.getAsync();
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Main;
//# sourceMappingURL=Main.js.map