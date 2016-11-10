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

        // tags
        this.contract.subsCount.callAsync = Promise.promisify(this.contract.subsCount.call);
        this.contract.subsFirst.callAsync = Promise.promisify(this.contract.subsFirst.call);
        this.contract.subsLast.callAsync = Promise.promisify(this.contract.subsLast.call);
        this.contract.subsNext.callAsync = Promise.promisify(this.contract.subsNext.call);
        this.contract.subsPrev.callAsync = Promise.promisify(this.contract.subsPrev.call);
    }

    public follow(id: string, gas: number = 2000000) {
        if(!id) {
            throw new Error('No Akasha ID provided');
        }
        return this.evaluateData('follow', gas, id);
    }

    public unFollow(id: string, gas: number = 2000000) {
        if(!id) {
            throw new Error('No Akasha ID provided');
        }
        return this.evaluateData('unFollow', gas, id);
    }

    public subscribe(tagName: string, gas: number = 2000000) {
        if(!tagName) {
            throw new Error('No tag provided');
        }
        const tagNameTr = this.gethInstance.web3.fromUtf8(tagName);
        return this.evaluateData('subscribe', gas, tagNameTr);
    }

    public unSubscribe(tagName: string, gas: number = 2000000) {
        if(!tagName) {
            throw new Error('No tag provided');
        }
        const tagNameTr = this.gethInstance.web3.fromUtf8(tagName);
        return this.evaluateData('unSubscribe', gas, tagNameTr);
    }

    public isFollowing(id: string) {
        return this.contract.isFollowing.callAsync(id);
    }

    public isFollower(id: string) {
        return this.contract.isFollower.callAsync(id);
    }

    public getFollowingCount(id: string) {
        return this.contract.getFollowingCount.callAsync(id).then((result) => result.toString());
    }

    public getFollowingFirst(id: string) {
        return this.contract.getFollowingFirst.callAsync(id).then((result) => result.toString());
    }

    public getFollowingLast(id: string) {
        return this.contract.getFollowingLast.callAsync(id).then((result) => result.toString());
    }

    public getFollowingNext(id: string, fromId: string) {
        return this.contract.getFollowingNext.callAsync(id, fromId).then((result) => result.toString());
    }

    public getFollowingPrev(id: string, fromId: string) {
        return this.contract.getFollowingPrev.callAsync(id, fromId).then((result) => result.toString());
    }

    public getFollowingById(id: string, indexId: string) {
        return this.contract.getFollowingById.callAsync(id, indexId);
    }

    public getFollowersCount(id: string) {
        return this.contract.getFollowersCount.callAsync(id).then((result) => result.toString());
    }

    public getFollowersFirst(id: string) {
        return this.contract.getFollowersFirst.callAsync(id).then((result) => result.toString());
    }

    public getFollowersLast(id: string) {
        return this.contract.getFollowersLast.callAsync(id).then((result) => result.toString());
    }

    public getFollowersNext(id: string, fromId: string) {
        return this.contract.getFollowersNext.callAsync(id, fromId).then((result) => result.toString());
    }

    public getFollowersPrev(id: string, fromId: string) {
        return this.contract.getFollowersPrev.callAsync(id, fromId).then((result) => result.toString());
    }

    public getFollowersById(id: string, indexId: string) {
        return this.contract.getFollowersById.callAsync(id, indexId);
    }

    public subsCount(id: string){
        return this.contract.subsCount.callAsync(id).then((result) => result.toString());
    }

    public subsFirst(id: string){
        return this.contract.subsFirst.callAsync(id).then((result) => result.toString());
    }

    public subsLast(id: string){
        return this.contract.subsLast.callAsync(id).then((result) => result.toString());
    }

    public subsNext(id: string, tagId: string){
        return this.contract.subsNext.callAsync(id, tagId).then((result) => result.toString());
    }

    public subsPrev(id: string, tagId: string){
        return this.contract.subsPrev.callAsync(id, tagId).then((result) => result.toString());
    }
}
