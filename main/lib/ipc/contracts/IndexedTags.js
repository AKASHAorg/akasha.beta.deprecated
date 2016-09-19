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
        const tagIdTr = this.gethInstance.web3.fromDecimal(tagId);
        return this.contract
            .isSubscribed
            .callAsync(subscriber, tagIdTr);
    }
    getSubPosition(subscriber, tagId) {
        const tagIdTr = this.gethInstance.web3.fromDecimal(tagId);
        return this.contract
            .getSubPosition
            .callAsync(subscriber, tagIdTr);
    }
    subscribe(tag, gas) {
        const tagTr = this.gethInstance.web3.fromUtf8(tag);
        return this.extractData('subscribe', tagTr, { gas: gas });
    }
    unsubscribe(tag, subPosition, gas) {
        const tagTr = this.gethInstance.web3.fromUtf8(tag);
        const subPositionTr = this.gethInstance.web3.fromDecimal(subPosition);
        return this.extractData('unsubscribe', tagTr, subPositionTr, { gas: gas });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = IndexedTags;
//# sourceMappingURL=IndexedTags.js.map