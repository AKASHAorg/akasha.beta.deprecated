"use strict";
const BaseContract_1 = require('./BaseContract');
const Promise = require('bluebird');
class IndexedTags extends BaseContract_1.default {
    constructor(instance) {
        super();
        this.contract = Promise.promisifyAll(instance);
        this.contract.isSubscribed.callAsync = Promise.promisify(this.contract.isSubscribed.call);
        this.contract.getSubPosition.callAsync = Promise.promisify(this.contract.getSubPosition.call);
    }
    isSubscribed(subscriber, tagId) {
        return this.contract
            .isSubscribed
            .callAsync(subscriber, tagId);
    }
    getSubPosition(subscriber, tagId) {
        return this.contract
            .getSubPosition
            .callAsync(subscriber, tagId)
            .then((positionBN) => positionBN.toString());
    }
    subscribe(tag, gas) {
        const tagTr = this.gethInstance.web3.fromUtf8(tag);
        return Promise.resolve(this.extractData('subscribe', tagTr, { gas }));
    }
    unsubscribe(tag, subPosition, gas) {
        const tagTr = this.gethInstance.web3.fromUtf8(tag);
        return Promise.resolve(this.extractData('unsubscribe', tagTr, subPosition, { gas }));
    }
    getIndexedTag(filter) {
        const { fromBlock, toBlock, address } = filter;
        const IndexedTag = this.contract.IndexedTag(filter.index, { fromBlock, toBlock, address });
        IndexedTag.getAsync = Promise.promisify(IndexedTag.get);
        return IndexedTag.getAsync();
    }
    getIndexTagError(filter) {
        const Error = this.contract.Error(filter);
        Error.getAsync = Promise.promisify(Error.get);
        return Error.getAsync();
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = IndexedTags;
//# sourceMappingURL=IndexedTags.js.map