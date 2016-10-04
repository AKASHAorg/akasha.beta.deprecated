import BaseContract from './BaseContract';
import * as Promise from 'bluebird';


export default class Main extends BaseContract {
    constructor(instance: any) {
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

    /**
     *
     * @param profile
     * @param entryAddress
     * @returns {any}
     */
    public getVoteOf(profile: string, entryAddress: string) {
        return this.contract
            .getVoteOf
            .callAsync(profile, entryAddress);
    }

    /**
     *
     * @param entryAddress
     * @returns {any}
     */
    public openedToVotes(entryAddress: string) {
        return this.contract
            .openedToVotes
            .callAsync(entryAddress);
    }

    /**
     *
     * @param entryAddress
     * @returns {any}
     */
    public voteEndDate(entryAddress: string) {
        return this.contract
            .voteEndDate
            .callAsync(entryAddress);
    }

    /**
     *
     * @param entryAddress
     * @returns {any}
     */
    public getScoreOfEntry(entryAddress: string) {
        return this.contract
            .getScoreOfEntry
            .callAsync(entryAddress);
    }

    /**
     *
     * @returns {any}
     */
    public getFundsAddress() {
        return this.contract
            .getFundsAddress
            .callAsync();
    }

    /**
     *
     * @param address
     * @returns {Bluebird<T>|any}
     */
    public getEntry(address: string) {
        return this.contract
            .getEntry
            .callAsync(address);
    }


    /**
     *
     * @param address
     * @param gas
     * @returns {any}
     */
    public follow(address: string, gas?: string) {
        return this.extractData('follow', address, { gas });
    }

    /**
     *
     * @param address
     * @returns {Bluebird<T>|any}
     */
    public getFollowingCount(address: string) {
        return this.contract
            .getFollowingCount
            .callAsync(address)
    }

    /**
     *
     * @param address
     * @returns {any}
     */
    public getEntriesCount(address: string) {
        return this.contract
            .getEntriesCount
            .callAsync(address);
    }

    public getEntryOf(address: string, position: number) {
        return this.contract
            .getEntryOf
            .callAsync(address, position);
    }


    /**
     *
     * @param address
     * @returns {Bluebird<T>|any}
     */
    public getFollowersCount(address: string) {
        return this.contract
            .getFollowersCount
            .callAsync(address)
    }

    /**
     *
     * @param entryAddress
     * @returns {any}
     */
    public getCommentsCount(entryAddress: string) {
        return this.contract
            .getCommentsCount
            .callAsync(entryAddress);
    }

    /**
     *
     * @param address
     * @param position
     * @returns {Bluebird<T>|any}
     */
    public getFollowingAt(address: string, position: number) {
        return this.contract
            .getFollowingAt
            .callAsync(address, position);
    }

    /**
     *
     * @param address
     * @param position
     * @returns {any}
     */
    public getFollowerAt(address: string, position: number) {
        return this.contract
            .getFollowerAt
            .callAsync(address, position);
    }

    /**
     *
     * @param entry
     * @param commentId
     * @returns {any}
     */
    public getCommentAt(entry: string, commentId: number) {
        const commentIdTr = this.gethInstance.web3.fromDecimal(commentId);
        return this.contract
            .getCommentAt
            .callAsync(entry, commentIdTr);
    }

    /**
     *
     * @param entry
     * @param commentId
     * @returns {any}
     */
    public getScoreOfComment(entry: string, commentId: number) {
        const commentIdTr = this.gethInstance.web3.fromDecimal(commentId);
        return this.contract
            .getScoreOfComment
            .callAsync(entry, commentIdTr);
    }

    /**
     *
     * @param hash
     * @param tags
     * @param gas
     * @returns {any}
     */
    public publishEntry(hash: string[], tags: string[], gas?: number) {
        const hashTr = hash.map((v) => {
            return this.gethInstance.web3.fromUtf8(v);
        });
        const tagsTr = tags.map((v) => {
            return this.gethInstance.web3.fromUtf8(v);
        });
        return this.extractData('publishEntry', hashTr, tagsTr, { gas });
    }


    /**
     *
     * @param hash
     * @param entryAddress
     * @param gas
     * @returns {any}
     */
    public updateEntry(hash: string[], entryAddress: string, gas?: number) {
        const hashTr = hash.map((v) => {
            return this.gethInstance.web3.fromUtf8(v);
        });
        return this.extractData('updateEntry', hashTr, entryAddress, { gas });
    }

    /**
     *
     * @param entryAddress
     * @param weight
     * @param gas
     * @param value
     * @returns {any}
     */
    public upVoteEntry(entryAddress: string, weight: number, gas?: number, value?: number) {
        const weightTr = this.gethInstance.web3.fromDecimal(weight);
        return this.extractData('upVoteEntry', entryAddress, weightTr, { gas, value });
    }

    /**
     *
     * @param entryAddress
     * @param weight
     * @param gas
     * @param value
     * @returns {any}
     */
    public downVoteEntry(entryAddress: string, weight: number, gas?: number, value?: number) {
        const weightTr = this.gethInstance.web3.fromDecimal(weight);
        return this.extractData('downVoteEntry', entryAddress, weightTr, { gas, value });
    }

    /**
     *
     * @param entryAddress
     * @param hash
     * @param gas
     * @returns {any}
     */
    public saveComment(entryAddress: string, hash: string[], gas?: number) {
        const hashTr = hash.map((v) => {
            return this.gethInstance.web3.fromUtf8(v);
        });
        return this.extractData('saveComment', entryAddress, hashTr, { gas });
    }

    /**
     *
     * @param entryAddress
     * @param commentId
     * @param hash
     * @param gas
     * @returns {any}
     */
    public updateComment(entryAddress: string, commentId: number, hash: string[], gas?: number) {
        const hashTr = hash.map((v) => {
            return this.gethInstance.web3.fromUtf8(v);
        });
        const commentIdTr = this.gethInstance.web3.fromDecimal(commentId);
        return this.extractData('updateComment', entryAddress, commentIdTr, hashTr, { gas });
    }

    /**
     *
     * @param entryAddress
     * @param weigth
     * @param commentId
     * @param gas
     * @param value
     * @returns {any}
     */
    public upVoteComment(entryAddress: string, weigth: number, commentId: number, gas?: number, value?: number) {
        const weigthTr = this.gethInstance.web3.fromDecimal(weigth);
        const commentIdTr = this.gethInstance.web3.fromDecimal(commentId);
        return this.extractData('upVoteComment', entryAddress, weigthTr, commentIdTr, {
            gas,
            value
        });
    }

    /**
     *
     * @param entryAddress
     * @param weigth
     * @param commentId
     * @param gas
     * @param value
     * @returns {any}
     */
    public downVoteComment(entryAddress: string, weigth: number, commentId: number, gas?: number, value?: number) {
        const weigthTr = this.gethInstance.web3.fromDecimal(weigth);
        const commentIdTr = this.gethInstance.web3.fromDecimal(commentId);
        return this.extractData('downVoteCommentAsync', entryAddress, weigthTr, commentIdTr, {
            gas,
            value
        });
    }
}
