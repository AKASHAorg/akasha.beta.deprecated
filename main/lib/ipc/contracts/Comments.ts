import BaseContract from './BaseContract';
import * as Promise from 'bluebird';

export default class Comments extends BaseContract {
    /**
     *
     * @param instance
     */
    constructor(instance: any) {
        super();
        this.contract = instance;
        this.contract.getCommentsCount.callAsync = Promise.promisify(this.contract.getCommentsCount.call);
        this.contract.getComment.callAsync = Promise.promisify(this.contract.getComment.call);
        this.contract.getFirstComment.callAsync = Promise.promisify(this.contract.getFirstComment.call);
        this.contract.getLastComment.callAsync = Promise.promisify(this.contract.getLastComment.call);
        this.contract.getNextComment.callAsync = Promise.promisify(this.contract.getNextComment.call);
        this.contract.getPrevComment.callAsync = Promise.promisify(this.contract.getPrevComment.call);
    }

    /**
     *
     * @param entryId
     * @param hash
     * @param gas
     * @param parent
     * @returns {Bluebird<U>}
     */
    comment(entryId: string, hash: string, gas: number = 2000000, parent?: string) {
        const hashTr = this.splitIpfs(hash);
        return this.evaluateData('comment', gas, entryId, hashTr, parent);
    }

    /**
     *
     * @param entryId
     * @param commentId
     * @param gas
     * @returns {Bluebird<U>}
     */
    removeComment(entryId: string, commentId: string, gas: number = 2000000) {
        return this.evaluateData('removeComment', gas, entryId, commentId);
    }

    /**
     *
     * @param entryId
     * @param commentId
     * @returns {any}
     */
    getComment(entryId: string, commentId: string) {
        return this.contract
            .getComment
            .callAsync(entryId, commentId)
            .then((result) => {
                return {
                    profile: result[0],
                    idComment: result[1],
                    parent: result[2],
                    ipfsHash: this.flattenIpfs(result[3]),
                    active: !(result[4])
                }
            })
    }

    /**
     *
     * @param entryId
     * @returns {any}
     */
    getCommentsCount(entryId: string) {
        return this.contract
            .getCommentsCount
            .callAsync(entryId)
            .then((result) => result.toNumber());
    }

    /**
     *
     * @param entryId
     * @returns {any}
     */
    getFirstComment(entryId: string) {
        return this.contract
            .getFirstComment
            .callAsync(entryId)
            .then((result) => result.toString());
    }

    /**
     *
     * @param entryId
     * @returns {any}
     */
    getLastComment(entryId: string) {
        return this.contract
            .getLastComment
            .callAsync(entryId)
            .then((result) => result.toString());
    }

    /**
     *
     * @param entryId
     * @param commentId
     * @returns {any}
     */
    getNextComment(entryId: string, commentId: string) {
        return this.contract
            .getNextComment
            .callAsync(entryId, commentId)
            .then((result) => result.toString());
    }

    /**
     *
     * @param entryId
     * @param commentId
     * @returns {any}
     */
    getPrevComment(entryId: string, commentId: string) {
        return this.contract
            .getPrevComment
            .callAsync(entryId, commentId)
            .then((result) => result.toString());
    }
}
