"use strict";
const BaseContract_1 = require('./BaseContract');
const Promise = require('bluebird');
class Votes extends BaseContract_1.default {
    constructor(instance) {
        super();
        this.contract = instance;
        this.contract.getVoteCost.callAsync = Promise.promisify(this.contract.getVoteCost.call);
        this.contract.getVotesCount.callAsync = Promise.promisify(this.contract.getVotesCount.call);
        this.contract.getFirstVoteId.callAsync = Promise.promisify(this.contract.getFirstVoteId.call);
        this.contract.getLastVoteId.callAsync = Promise.promisify(this.contract.getLastVoteId.call);
        this.contract.getNextVoteId.callAsync = Promise.promisify(this.contract.getNextVoteId.call);
        this.contract.getPrevVoteId.callAsync = Promise.promisify(this.contract.getPrevVoteId.call);
        this.contract.getVoteOf.callAsync = Promise.promisify(this.contract.getVoteOf.call);
        this.contract.getScore.callAsync = Promise.promisify(this.contract.getScore.call);
        this.contract.getVoteOfProfile.callAsync = Promise.promisify(this.contract.getVoteOfProfile.call);
    }
    upvote(entryId, weight, value, gas = 2000000) {
        value = this.gethInstance.web3.toWei(value, 'ether');
        return Promise.resolve(this.extractData('upvote', weight, entryId, { gas, value }));
    }
    downvote(entryId, weight, value, gas = 2000000) {
        value = this.gethInstance.web3.toWei(value, 'ether');
        return Promise.resolve(this.extractData('downvote', weight, entryId, { gas, value }));
    }
    getVoteCost(weight) {
        return this.contract
            .getVoteCost
            .callAsync(weight)
            .then((cost) => (this.gethInstance.web3.fromWei(cost, 'ether')).toString(10));
    }
    getVotesCount(entryId) {
        return this.contract
            .getVotesCount
            .callAsync(entryId)
            .then((result) => result.toNumber());
    }
    getFirstVoteId(entryId) {
        return this.contract
            .getFirstVoteId
            .callAsync(entryId)
            .then((result) => {
            return result.toString();
        });
    }
    getLastVoteId(entryId) {
        return this.contract
            .getLastVoteId
            .callAsync(entryId)
            .then((result) => result.toString());
    }
    getNextVoteId(entryId, voteId) {
        return this.contract
            .getNextVoteId
            .callAsync(entryId, voteId)
            .then((result) => result.toString());
    }
    getPrevVoteId(entryId, voteId) {
        return this.contract
            .getPrevVoteId
            .callAsync(entryId, voteId)
            .then((result) => result.toString());
    }
    getVoteOf(entryId, voteId) {
        return this.contract
            .getVoteOf
            .callAsync(entryId, voteId)
            .then((result) => {
            return { profile: result[0], score: (result[1]).toString() };
        });
    }
    getVoteOfProfile(entryId, akashaId) {
        return this.contract
            .getVoteOfProfile
            .callAsync(entryId, akashaId)
            .then((result) => result.toNumber());
    }
    getScore(entryId) {
        return this.contract
            .getScore
            .callAsync(entryId)
            .then((result) => result.toString());
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Votes;
//# sourceMappingURL=Votes.js.map