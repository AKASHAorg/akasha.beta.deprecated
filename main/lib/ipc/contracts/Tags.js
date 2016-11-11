"use strict";
const BaseContract_1 = require('./BaseContract');
const Promise = require('bluebird');
class Tags extends BaseContract_1.default {
    constructor(instance) {
        super();
        this.contract = Promise.promisifyAll(instance);
        this.contract.exists.callAsync = Promise.promisify(this.contract.exists.call);
        this.contract.getTagName.callAsync = Promise.promisify(this.contract.getTagName.call);
        this.contract.getTagId.callAsync = Promise.promisify(this.contract.getTagId.call);
        this.contract.getTagCount.callAsync = Promise.promisify(this.contract.getTagCount.call);
        this.contract.getFirstTag.callAsync = Promise.promisify(this.contract.getFirstTag.call);
        this.contract.getLastTag.callAsync = Promise.promisify(this.contract.getLastTag.call);
        this.contract.nextTag.callAsync = Promise.promisify(this.contract.nextTag.call);
        this.contract.prevTag.callAsync = Promise.promisify(this.contract.prevTag.call);
        this.contract.check_format.callAsync = Promise.promisify(this.contract.check_format.call);
    }
    exists(tag) {
        const tagTr = this.gethInstance.web3.fromUtf8(tag);
        return this.contract
            .exists
            .callAsync(tagTr);
    }
    getTagsCount() {
        return this.contract
            .getTagCount
            .callAsync()
            .then((nr) => nr.toNumber());
    }
    getTagId(tagName) {
        const tagTr = this.gethInstance.web3.fromUtf8(tagName);
        return this.contract.getTagId.callAsync(tagTr).then((nr) => nr.toString());
    }
    getTagName(tagId) {
        return this.contract
            .getTagName
            .callAsync(tagId)
            .then((name) => this.gethInstance.web3.toUtf8(name));
    }
    checkFormat(tagName) {
        const tagTr = this.gethInstance.web3.fromUtf8(tagName);
        return this.contract
            .check_format
            .callAsync(tagTr);
    }
    getFirstTag() {
        return this.contract.getFirstTag.callAsync().then((id) => id.toString());
    }
    getLastTag() {
        return this.contract.getLastTag.callAsync().then((id) => id.toString());
    }
    getNextTag(idTag) {
        return this.contract.nextTag.callAsync(idTag).then((id) => id.toString());
    }
    getPrevTag(idTag) {
        return this.contract.prevTag.callAsync(idTag).then((id) => id.toString());
    }
    add(tag, gas) {
        const tagTr = this.gethInstance.web3.fromUtf8(tag);
        return this.contract
            .exists
            .callAsync(tagTr)
            .then((found) => {
            if (found) {
                throw new Error('Tag already exists');
            }
            return this.contract
                .check_format
                .callAsync(tagTr);
        })
            .then((hasFormat) => {
            if (!hasFormat) {
                throw new Error('Provided Tag has illegal characters');
            }
            return this.extractData('add', tagTr, { gas });
        });
    }
    getTagsCreated(filter) {
        const { fromBlock, toBlock, address } = filter;
        const TagsCreated = this.contract.Create(filter.index, { fromBlock, toBlock, address });
        TagsCreated.getAsync = Promise.promisify(TagsCreated.get);
        return TagsCreated.getAsync();
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Tags;
//# sourceMappingURL=Tags.js.map