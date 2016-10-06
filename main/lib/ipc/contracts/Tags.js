"use strict";
const BaseContract_1 = require('./BaseContract');
const Promise = require('bluebird');
class Tags extends BaseContract_1.default {
    constructor(instance) {
        super();
        this.contract = Promise.promisifyAll(instance);
        this.contract.exists.callAsync = Promise.promisify(this.contract.exists.call);
        this.contract.getTagAt.callAsync = Promise.promisify(this.contract.getTagAt.call);
        this.contract.getTagId.callAsync = Promise.promisify(this.contract.getTagId.call);
        this.contract._length.callAsync = Promise.promisify(this.contract._length.call);
    }
    exists(tag) {
        const tagTr = this.gethInstance.web3.fromUtf8(tag);
        return this.contract
            .exists
            .callAsync(tagTr);
    }
    getTagAt(id) {
        return this.contract
            .getTagAt
            .callAsync(id);
    }
    getTagsCount() {
        return this.contract._length.callAsync();
    }
    getTagId(tagName) {
        const tagTr = this.gethInstance.web3.fromUtf8(tagName);
        this.contract.getTagId.callAsync(tagTr);
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
            return this.extractData('add', tag, { gas });
        });
    }
    getCreateError(filter) {
        const Error = this.contract.Error(filter);
        Error.getAsync = Promise.promisify(Error.get);
        return Error.getAsync();
    }
    getTagsCreated(filter) {
        const { fromBlock, toBlock, address } = filter;
        const TagsCreated = this.contract.TagCreated(filter.index, { fromBlock, toBlock, address });
        TagsCreated.getAsync = Promise.promisify(TagsCreated.get);
        return TagsCreated.getAsync();
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Tags;
//# sourceMappingURL=Tags.js.map