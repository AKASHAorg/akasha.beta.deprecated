import BaseContract from './BaseContract';
import * as Promise from 'bluebird';

export default class Entries extends BaseContract {
    /**
     *
     * @param instance
     */
    constructor(instance: any) {
        super();
        this.contract = instance;
        this.contract.getProfileEntriesCount.callAsync = Promise.promisify(this.contract.getProfileEntriesCount.call);
        this.contract.getProfileEntryFirst.callAsync = Promise.promisify(this.contract.getProfileEntryFirst.call);
        this.contract.getProfileEntryLast.callAsync = Promise.promisify(this.contract.getProfileEntryLast.call);
        this.contract.getProfileEntryNext.callAsync = Promise.promisify(this.contract.getProfileEntryNext.call);
        this.contract.getProfileEntryPrev.callAsync = Promise.promisify(this.contract.getProfileEntryPrev.call);
        this.contract.getTagEntriesCount.callAsync = Promise.promisify(this.contract.getTagEntriesCount.call);
        this.contract.getTagEntryFirst.callAsync = Promise.promisify(this.contract.getTagEntryFirst.call);
        this.contract.getTagEntryLast.callAsync = Promise.promisify(this.contract.getTagEntryLast.call);
        this.contract.getTagEntryNext.callAsync = Promise.promisify(this.contract.getTagEntryNext.call);
        this.contract.getTagEntryPrev.callAsync = Promise.promisify(this.contract.getTagEntryPrev.call);
        this.contract.isEditable.callAsync = Promise.promisify(this.contract.isEditable.call);
        this.contract.getEntry.callAsync = Promise.promisify(this.contract.getEntry.call);
        this.contract.getEntryFund.callAsync = Promise.promisify(this.contract.getEntryFund.call);
        this.contract.entryExists.callAsync = Promise.promisify(this.contract.entryExists.call);
    }

    public publish(hash: string, tags: string[], gas: number = 3000000) {
        const hashTr = this.splitIpfs(hash);
        return this.evaluateData('publish', gas, hashTr, tags);
    }

    /**
     *
     * @param hash
     * @param entryId
     * @param gas
     * @returns {Bluebird<U>}
     */
    public updateEntryContent(hash: string, entryId: string|number, gas: number = 2000000) {
        const hashTr = this.splitIpfs(hash);
        return this.evaluateData('updateEntryContent', gas, hashTr, entryId);
    }

    /**
     *
     * @param entryId
     * @param gas
     * @returns {Bluebird<U>}
     */
    public claimDeposit(entryId: string|number, gas: number = 2000000) {
        return this.evaluateData('claimDeposit', gas, entryId);
    }

    /**
     *
     * @param profileAddress
     * @returns {any}
     */
    public getProfileEntriesCount(profileAddress: string){
        return this.contract
            .getProfileEntriesCount
            .callAsync(profileAddress).then((result) => result.toNumber());
    }

    /**
     *
     * @param profileAddress
     * @returns {any}
     */
    public getProfileEntryFirst(profileAddress: string) {
        return this.contract
            .getProfileEntryFirst
            .callAsync(profileAddress).then((result) => result.toString());
    }

    /**
     *
     * @param profileAddress
     * @returns {any}
     */
    public getProfileEntryLast(profileAddress: string) {
        return this.contract
            .getProfileEntryLast
            .callAsync(profileAddress).then((result) => result.toString());
    }

    /**
     *
     * @param profileAddress
     * @param entryId
     * @returns {any}
     */
    public getProfileEntryNext(profileAddress: string, entryId: string) {
        return this.contract
            .getProfileEntryNext
            .callAsync(profileAddress, entryId).then((result) => result.toString());
    }

    /**
     *
     * @param profileAddress
     * @param entryId
     * @returns {any}
     */
    public getProfileEntryPrev(profileAddress: string, entryId: string) {
        return this.contract
            .getProfileEntryPrev
            .callAsync(profileAddress, entryId).then((result) => result.toString());
    }

    /**
     *
     * @param tagName
     * @returns {any}
     */
    public getTagEntriesCount(tagName: string) {
        return this.contract
            .getTagEntriesCount
            .callAsync(tagName).then((result) => result.toNumber());
    }

    /**
     *
     * @param tagName
     * @returns {any}
     */
    public getTagEntryFirst(tagName: string) {
        return this.contract
            .getTagEntryFirst
            .callAsync(tagName).then((result) => result.toString());
    }

    /**
     *
     * @param tagName
     * @returns {any}
     */
    public getTagEntryLast(tagName: string) {
        return this.contract
            .getTagEntryLast
            .callAsync(tagName).then((result) => result.toString());
    }

    /**
     *
     * @param tagName
     * @param entryId
     * @returns {any}
     */
    public getTagEntryNext(tagName: string, entryId: string) {
        return this.contract
            .getTagEntryNext
            .callAsync(tagName, entryId).then((result) => result.toString());
    }

    /**
     *
     * @param tagName
     * @param entryId
     * @returns {any}
     */
    public getTagEntryPrev(tagName: string, entryId: string) {
        return this.contract
            .getTagEntryPrev
            .callAsync(tagName, entryId).then((result) => result.toString());
    }

    /**
     *
     * @param entryId
     * @returns {any}
     */
    public isMutable(entryId: string) {
        return this.contract
            .isEditable
            .callAsync(entryId).then((result) => result);
    }

    /**
     *
     * @param entryId
     * @returns {any}
     */
    public getEntry(entryId: string) {
        return this.contract
            .getEntry
            .callAsync(entryId).then((result) => {
                return {
                    blockNr: result.blockNr.toNumber(),
                    publisher: result.publisher,
                    ipfsHash: this.flattenIpfs(result.ipfsHash)
                }
            });
    }

    /**
     *
     * @param entryId
     * @returns {any}
     */
    public getEntryFund(entryId: string) {
        return this.contract
            .getEntryFund
            .callAsync(entryId).then((result) => result);
    }

    /**
     *
     * @param entryId
     * @returns {any}
     */
    public entryExists(entryId: string) {
        return this.contract
            .entryExists
            .callAsync(entryId).then((result) => result);
    }

}
