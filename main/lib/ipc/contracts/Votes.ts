import BaseContract from './BaseContract';
import * as Promise from 'bluebird';

export default class Votes extends BaseContract {
    /**
     *
     * @param instance
     */
    constructor(instance: any) {
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

    /**
     *
     * @param entryId
     * @param weight
     * @param gas
     * @param value
     * @returns {Bluebird<R>}
     */
    upvote(entryId: string, weight: number, value: string, gas: number = 2000000) {
        value = this.gethInstance.web3.toWei(value, 'ether');
        return Promise.resolve(this.extractData('upvote', weight, entryId, { gas, value }));
    }

    /**
     *
     * @param entryId
     * @param weight
     * @param gas
     * @param value
     * @returns {Bluebird<R>}
     */
    downvote(entryId: string, weight: number, gas: number = 2000000, value: string) {
        value = this.gethInstance.web3.toWei(value, 'ether');
        return Promise.resolve(this.extractData('downvote', weight, entryId, { gas, value }));
    }

    /**
     *
     * @param weight
     * @returns {any}
     */
    getVoteCost(weight: number) {
        return this.contract
            .getVoteCost
            .callAsync(weight)
            .then((cost) => (this.gethInstance.web3.fromWei(cost, 'ether')).toString(10))
    }

    /**
     *
     * @param entryId
     * @returns {any}
     */
    getVotesCount(entryId: string) {
        return this.contract
            .getVotesCount
            .callAsync(entryId)
            .then((result) => result.toNumber());
    }

    /**
     *
     * @param entryId
     * @returns {any}
     */
    getFirstVoteId(entryId: string) {
        return this.contract
            .getFirstVoteId
            .callAsync(entryId)
            .then((result) => result.toString());
    }

    /**
     *
     * @param entryId
     * @returns {any}
     */
    getLastVoteId(entryId: string) {
        return this.contract
            .getLastVoteId
            .callAsync(entryId)
            .then((result) => result.toString());
    }

    /**
     *
     * @param entryId
     * @param voteId
     * @returns {any}
     */
    getNextVoteId(entryId: string, voteId: string) {
        return this.contract
            .getNextVoteId
            .callAsync(entryId, voteId)
            .then((result) => result.toString());
    }

    /**
     *
     * @param entryId
     * @param voteId
     * @returns {any}
     */
    getPrevVoteId(entryId: string, voteId: string) {
        return this.contract
            .getPrevVoteId
            .callAsync(entryId, voteId)
            .then((result) => result.toString());
    }

    /**
     *
     * @param entryId
     * @param voteId
     * @returns {any}
     */
    getVoteOf(entryId: string, voteId: string) {
        return this.contract
            .getVoteOf
            .callAsync(entryId, voteId)
            .then((result) => {
                return { profile: result.profile, score: (result.score).toString() };
            });
    }

    /**
     *
     * @param entryId
     * @param akashaId
     * @returns {any}
     */
    getVoteOfProfile(entryId: string, akashaId: string) {
        return this.contract
            .getVoteOfProfile
            .callAsync(entryId, akashaId)
            .then((result) => result.toNumber());

    }

    /**
     *
     * @param entryId
     * @returns {any}
     */
    getScore(entryId: string) {
        return this.contract
            .getScore
            .callAsync(entryId)
            .then((result) => result.toString());
    }
}
