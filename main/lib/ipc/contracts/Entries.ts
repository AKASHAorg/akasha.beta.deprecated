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

    public updateEntryContent(hash: string, entryId: string|number, gas: number = 2000000) {
        const hashTr = this.splitIpfs(hash);
        return this.evaluateData('updateEntryContent', gas, hashTr, entryId);
    }

    public claimDeposit(entryId: string|number, gas: number = 2000000) {
        return this.evaluateData('claimDeposit', gas, entryId);
    }


}
