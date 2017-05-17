import BaseContract from './BaseContract';
import * as Promise from 'bluebird';

export default class Feed extends BaseContract {
    /**
     *
     * @param instance
     */
    constructor(instance: any) {
        super();
        this.contract = instance;
        // profile
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

    public follow(id: string, gas: number = 2000000) {
        if (!id) {
            throw new Error('No Akasha ID provided');
        }
        const idTr = this.gethInstance.web3.fromUtf8(id);
        return this.evaluateData('follow', gas, idTr);
    }

    public unFollow(id: string, gas: number = 2000000) {
        if (!id) {
            throw new Error('No Akasha ID provided');
        }
        const idTr = this.gethInstance.web3.fromUtf8(id);
        return this.evaluateData('unFollow', gas, idTr);
    }

    public isFollowing(follower: string, id: string) {
        const idTr = this.gethInstance.web3.fromUtf8(id);
        const followerTr = this.gethInstance.web3.fromUtf8(follower);
        return this.contract.isFollowing.callAsync(followerTr, idTr);
    }

    public isFollower(id: string, following: string) {
        const idTr = this.gethInstance.web3.fromUtf8(id);
        const followingTr = this.gethInstance.web3.fromUtf8(following);
        return this.contract.isFollower.callAsync(idTr, followingTr);
    }

    public getFollowingCount(id: string) {
        const idTr = this.gethInstance.web3.fromUtf8(id);
        return this.contract.getFollowingCount.callAsync(idTr).then((result) => result.toString());
    }

    public getFollowingFirst(id: string) {
        const idTr = this.gethInstance.web3.fromUtf8(id);
        return this.contract.getFollowingFirst.callAsync(idTr).then((result) => result.toString());
    }

    public getFollowingLast(id: string) {
        const idTr = this.gethInstance.web3.fromUtf8(id);
        return this.contract.getFollowingLast.callAsync(idTr).then((result) => result.toString());
    }

    public getFollowingNext(id: string, fromId: string) {
        const idTr = this.gethInstance.web3.fromUtf8(id);
        return this.contract.getFollowingNext.callAsync(idTr, fromId).then((result) => result.toString());
    }

    public getFollowingPrev(id: string, fromId: string) {
        const idTr = this.gethInstance.web3.fromUtf8(id);
        return this.contract.getFollowingPrev.callAsync(idTr, fromId).then((result) => result.toString());
    }

    public getFollowingById(id: string, indexId: string) {
        const idTr = this.gethInstance.web3.fromUtf8(id);
        return this.contract.getFollowingById.callAsync(idTr, indexId);
    }

    public getFollowersCount(id: string) {
        const idTr = this.gethInstance.web3.fromUtf8(id);
        return this.contract.getFollowersCount.callAsync(idTr).then((result) => result.toString());
    }

    public getFollowersFirst(id: string) {
        const idTr = this.gethInstance.web3.fromUtf8(id);
        return this.contract.getFollowersFirst.callAsync(idTr).then((result) => result.toString());
    }

    public getFollowersLast(id: string) {
        const idTr = this.gethInstance.web3.fromUtf8(id);
        return this.contract.getFollowersLast.callAsync(idTr).then((result) => result.toString());
    }

    public getFollowersNext(id: string, fromId: string) {
        const idTr = this.gethInstance.web3.fromUtf8(id);
        return this.contract.getFollowersNext.callAsync(idTr, fromId).then((result) => result.toString());
    }

    public getFollowersPrev(id: string, fromId: string) {
        const idTr = this.gethInstance.web3.fromUtf8(id);
        return this.contract.getFollowersPrev.callAsync(idTr, fromId).then((result) => result.toString());
    }

    public getFollowersById(id: string, indexId: string) {
        const idTr = this.gethInstance.web3.fromUtf8(id);
        return this.contract.getFollowersById.callAsync(idTr, indexId);
    }

}
