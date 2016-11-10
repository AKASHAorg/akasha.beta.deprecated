"use strict";
const BaseContract_1 = require('./BaseContract');
const Promise = require('bluebird');
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
        this.contract.subsCount.callAsync = Promise.promisify(this.contract.subsCount.call);
        this.contract.subsFirst.callAsync = Promise.promisify(this.contract.subsFirst.call);
        this.contract.subsLast.callAsync = Promise.promisify(this.contract.subsLast.call);
        this.contract.subsNext.callAsync = Promise.promisify(this.contract.subsNext.call);
        this.contract.subsPrev.callAsync = Promise.promisify(this.contract.subsPrev.call);
    }
    follow(id, gas = 2000000) {
        if (!id) {
            throw new Error('No Akasha ID provided');
        }
        return this.evaluateData('follow', gas, id);
    }
    unFollow(id, gas = 2000000) {
        if (!id) {
            throw new Error('No Akasha ID provided');
        }
        return this.evaluateData('unFollow', gas, id);
    }
    subscribe(tagName, gas = 2000000) {
        if (!tagName) {
            throw new Error('No tag provided');
        }
        const tagNameTr = this.gethInstance.web3.fromUtf8(tagName);
        return this.evaluateData('subscribe', gas, tagNameTr);
    }
    unSubscribe(tagName, gas = 2000000) {
        if (!tagName) {
            throw new Error('No tag provided');
        }
        const tagNameTr = this.gethInstance.web3.fromUtf8(tagName);
        return this.evaluateData('unSubscribe', gas, tagNameTr);
    }
    isFollowing(id) {
        return this.contract.isFollowing.callAsync(id);
    }
    isFollower(id) {
        return this.contract.isFollower.callAsync(id);
    }
    getFollowingCount(id) {
        return this.contract.getFollowingCount.callAsync(id).then((result) => result.toString());
    }
    getFollowingFirst(id) {
        return this.contract.getFollowingFirst.callAsync(id).then((result) => result.toString());
    }
    getFollowingLast(id) {
        return this.contract.getFollowingLast.callAsync(id).then((result) => result.toString());
    }
    getFollowingNext(id, fromId) {
        return this.contract.getFollowingNext.callAsync(id, fromId).then((result) => result.toString());
    }
    getFollowingPrev(id, fromId) {
        return this.contract.getFollowingPrev.callAsync(id, fromId).then((result) => result.toString());
    }
    getFollowingById(id, indexId) {
        return this.contract.getFollowingById.callAsync(id, indexId);
    }
    getFollowersCount(id) {
        return this.contract.getFollowersCount.callAsync(id).then((result) => result.toString());
    }
    getFollowersFirst(id) {
        return this.contract.getFollowersFirst.callAsync(id).then((result) => result.toString());
    }
    getFollowersLast(id) {
        return this.contract.getFollowersLast.callAsync(id).then((result) => result.toString());
    }
    getFollowersNext(id, fromId) {
        return this.contract.getFollowersNext.callAsync(id, fromId).then((result) => result.toString());
    }
    getFollowersPrev(id, fromId) {
        return this.contract.getFollowersPrev.callAsync(id, fromId).then((result) => result.toString());
    }
    getFollowersById(id, indexId) {
        return this.contract.getFollowersById.callAsync(id, indexId);
    }
    subsCount(id) {
        return this.contract.subsCount.callAsync(id).then((result) => result.toString());
    }
    subsFirst(id) {
        return this.contract.subsFirst.callAsync(id).then((result) => result.toString());
    }
    subsLast(id) {
        return this.contract.subsLast.callAsync(id).then((result) => result.toString());
    }
    subsNext(id, tagId) {
        return this.contract.subsNext.callAsync(id, tagId).then((result) => result.toString());
    }
    subsPrev(id, tagId) {
        return this.contract.subsPrev.callAsync(id, tagId).then((result) => result.toString());
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Feed;
//# sourceMappingURL=Feed.js.map