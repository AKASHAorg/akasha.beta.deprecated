"use strict";
const BaseContract_1 = require("./BaseContract");
const Promise = require("bluebird");
class Feed extends BaseContract_1.default {
    constructor(instance) {
        super();
        this.contract = instance;
        this.contract.isFollowing.callAsync = Promise.promisify(this.contract.isFollowing.call);
        this.contract.isFollower.callAsync = Promise.promisify(this.contract.isFollower.call);
        this.contract.getFollowingCount.callAsync = Promise.promisify(this.contract.getFollowingCount.call);
        this.contract.getFollowingFirst.callAsync = Promise.promisify(this.contract.getFollowingFirst.call);
        this.contract.getFollowingLast.callAsync = Promise.promisify(this.contract.getFollowingLast.call);
        this.contract.getFollowingNext.callAsync = Promise.promisify(this.contract.getFollowingNext.call);
        this.contract.getFollowingPrev.callAsync = Promise.promisify(this.contract.getFollowingPrev.call);
        this.contract.getFollowingById.callAsync = Promise.promisify(this.contract.getFollowingById.call);
        this.contract.getFollowersCount.callAsync = Promise.promisify(this.contract.getFollowersCount.call);
        this.contract.getFollowersFirst.callAsync = Promise.promisify(this.contract.getFollowersFirst.call);
        this.contract.getFollowersLast.callAsync = Promise.promisify(this.contract.getFollowersLast.call);
        this.contract.getFollowersNext.callAsync = Promise.promisify(this.contract.getFollowersNext.call);
        this.contract.getFollowersPrev.callAsync = Promise.promisify(this.contract.getFollowersPrev.call);
        this.contract.getFollowersById.callAsync = Promise.promisify(this.contract.getFollowersById.call);
    }
    follow(id, gas = 2000000) {
        if (!id) {
            throw new Error('No Akasha ID provided');
        }
        const idTr = this.gethInstance.web3.fromUtf8(id);
        return this.evaluateData('follow', gas, idTr);
    }
    unFollow(id, gas = 2000000) {
        if (!id) {
            throw new Error('No Akasha ID provided');
        }
        const idTr = this.gethInstance.web3.fromUtf8(id);
        return this.evaluateData('unFollow', gas, idTr);
    }
    isFollowing(follower, id) {
        const idTr = this.gethInstance.web3.fromUtf8(id);
        const followerTr = this.gethInstance.web3.fromUtf8(follower);
        return this.contract.isFollowing.callAsync(followerTr, idTr);
    }
    isFollower(id, following) {
        const idTr = this.gethInstance.web3.fromUtf8(id);
        const followingTr = this.gethInstance.web3.fromUtf8(following);
        return this.contract.isFollower.callAsync(idTr, followingTr);
    }
    getFollowingCount(id) {
        const idTr = this.gethInstance.web3.fromUtf8(id);
        return this.contract.getFollowingCount.callAsync(idTr).then((result) => result.toString());
    }
    getFollowingFirst(id) {
        const idTr = this.gethInstance.web3.fromUtf8(id);
        return this.contract.getFollowingFirst.callAsync(idTr).then((result) => result.toString());
    }
    getFollowingLast(id) {
        const idTr = this.gethInstance.web3.fromUtf8(id);
        return this.contract.getFollowingLast.callAsync(idTr).then((result) => result.toString());
    }
    getFollowingNext(id, fromId) {
        const idTr = this.gethInstance.web3.fromUtf8(id);
        return this.contract.getFollowingNext.callAsync(idTr, fromId).then((result) => result.toString());
    }
    getFollowingPrev(id, fromId) {
        const idTr = this.gethInstance.web3.fromUtf8(id);
        return this.contract.getFollowingPrev.callAsync(idTr, fromId).then((result) => result.toString());
    }
    getFollowingById(id, indexId) {
        const idTr = this.gethInstance.web3.fromUtf8(id);
        return this.contract.getFollowingById.callAsync(idTr, indexId);
    }
    getFollowersCount(id) {
        const idTr = this.gethInstance.web3.fromUtf8(id);
        return this.contract.getFollowersCount.callAsync(idTr).then((result) => result.toString());
    }
    getFollowersFirst(id) {
        const idTr = this.gethInstance.web3.fromUtf8(id);
        return this.contract.getFollowersFirst.callAsync(idTr).then((result) => result.toString());
    }
    getFollowersLast(id) {
        const idTr = this.gethInstance.web3.fromUtf8(id);
        return this.contract.getFollowersLast.callAsync(idTr).then((result) => result.toString());
    }
    getFollowersNext(id, fromId) {
        const idTr = this.gethInstance.web3.fromUtf8(id);
        return this.contract.getFollowersNext.callAsync(idTr, fromId).then((result) => result.toString());
    }
    getFollowersPrev(id, fromId) {
        const idTr = this.gethInstance.web3.fromUtf8(id);
        return this.contract.getFollowersPrev.callAsync(idTr, fromId).then((result) => result.toString());
    }
    getFollowersById(id, indexId) {
        const idTr = this.gethInstance.web3.fromUtf8(id);
        return this.contract.getFollowersById.callAsync(idTr, indexId);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Feed;
//# sourceMappingURL=Feed.js.map