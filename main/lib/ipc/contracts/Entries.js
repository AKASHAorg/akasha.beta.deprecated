"use strict";
const BaseContract_1 = require("./BaseContract");
const Promise = require("bluebird");
const ethereumjs_util_1 = require("ethereumjs-util");
class Entries extends BaseContract_1.default {
    constructor(instance) {
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
    publish(hash, tags, gas = 3000000) {
        const hashTr = this.splitIpfs(hash);
        return this.evaluateData('publish', gas, hashTr, tags);
    }
    updateEntryContent(hash, entryId, gas = 2000000) {
        const hashTr = this.splitIpfs(hash);
        return this.evaluateData('updateEntryContent', gas, hashTr, entryId);
    }
    claimDeposit(entryId, gas = 2000000) {
        return this.evaluateData('claimDeposit', gas, entryId);
    }
    getProfileEntriesCount(akashaId) {
        const akashaIdTr = this.gethInstance.web3.fromUtf8(akashaId);
        return this.contract
            .getProfileEntriesCount
            .callAsync(akashaIdTr).then((result) => result.toString());
    }
    getProfileEntryFirst(akashaId) {
        const akashaIdTr = this.gethInstance.web3.fromUtf8(akashaId);
        return this.contract
            .getProfileEntryFirst
            .callAsync(akashaIdTr).then((result) => result.toString());
    }
    getProfileEntryLast(akashaId) {
        const akashaIdTr = this.gethInstance.web3.fromUtf8(akashaId);
        return this.contract
            .getProfileEntryLast
            .callAsync(akashaIdTr).then((result) => result.toString());
    }
    getProfileEntryNext(akashaId, entryId) {
        const akashaIdTr = this.gethInstance.web3.fromUtf8(akashaId);
        return this.contract
            .getProfileEntryNext
            .callAsync(akashaIdTr, entryId).then((result) => result.toString());
    }
    getProfileEntryPrev(akashaId, entryId) {
        const akashaIdTr = this.gethInstance.web3.fromUtf8(akashaId);
        return this.contract
            .getProfileEntryPrev
            .callAsync(akashaIdTr, entryId).then((result) => result.toString());
    }
    getTagEntriesCount(tagName) {
        return this.contract
            .getTagEntriesCount
            .callAsync(tagName).then((result) => result.toNumber());
    }
    getTagEntryFirst(tagName) {
        return this.contract
            .getTagEntryFirst
            .callAsync(tagName).then((result) => result.toString());
    }
    getTagEntryLast(tagName) {
        return this.contract
            .getTagEntryLast
            .callAsync(tagName).then((result) => result.toString());
    }
    getTagEntryNext(tagName, entryId) {
        return this.contract
            .getTagEntryNext
            .callAsync(tagName, entryId).then((result) => result.toString());
    }
    getTagEntryPrev(tagName, entryId) {
        return this.contract
            .getTagEntryPrev
            .callAsync(tagName, entryId).then((result) => result.toString());
    }
    isMutable(entryId) {
        return this.contract
            .isEditable
            .callAsync(entryId).then((result) => result);
    }
    getEntry(entryId) {
        return this.contract
            .getEntry
            .callAsync(entryId).then((result) => {
            return {
                blockNr: (result[0]).toNumber(),
                publisher: result[1],
                ipfsHash: this.flattenIpfs(result[2]),
                unixStamp: (result[3]).toNumber()
            };
        });
    }
    getEntryFund(entryId) {
        return this.contract
            .getEntryFund
            .callAsync(entryId).then((result) => {
            if (!!ethereumjs_util_1.unpad(result)) {
                return result;
            }
            return '';
        });
    }
    entryExists(entryId) {
        return this.contract
            .entryExists
            .callAsync(entryId).then((result) => result);
    }
    getPublished(filter) {
        const Published = this.contract.Publish({}, { fromBlock: filter.fromBlock, toBlock: filter.toBlock });
        Published.getAsync = Promise.promisify(Published.get);
        return Published.getAsync();
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Entries;
//# sourceMappingURL=Entries.js.map