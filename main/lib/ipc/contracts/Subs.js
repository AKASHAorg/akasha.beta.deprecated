"use strict";
const BaseContract_1 = require('./BaseContract');
const Promise = require('bluebird');
class Subs extends BaseContract_1.default {
    constructor(instance) {
        super();
        this.contract = instance;
        this.contract.subsCount.callAsync = Promise.promisify(this.contract.subsCount.call);
        this.contract.subsFirst.callAsync = Promise.promisify(this.contract.subsFirst.call);
        this.contract.subsLast.callAsync = Promise.promisify(this.contract.subsLast.call);
        this.contract.subsNext.callAsync = Promise.promisify(this.contract.subsNext.call);
        this.contract.subsPrev.callAsync = Promise.promisify(this.contract.subsPrev.call);
        this.contract.isSubscribed.callAsync = Promise.promisify(this.contract.isSubscribed.call);
    }
    subscribe(tagName, gas = 2000000) {
        if (!tagName) {
            throw new Error('No tag provided');
        }
        const tagNameTr = this.gethInstance.web3.fromUtf8(tagName);
        return this.evaluateData('subscribe', gas, tagNameTr);
    }
    unSubscribe(tagName, gas = 2000000) {
        if (!tagName) {
            throw new Error('No tag provided');
        }
        const tagNameTr = this.gethInstance.web3.fromUtf8(tagName);
        return this.evaluateData('unSubscribe', gas, tagNameTr);
    }
    subsCount(id) {
        const idTr = this.gethInstance.web3.fromUtf8(id);
        return this.contract.subsCount.callAsync(idTr).then((result) => result.toString());
    }
    subsFirst(id) {
        const idTr = this.gethInstance.web3.fromUtf8(id);
        return this.contract.subsFirst.callAsync(idTr).then((result) => result.toString());
    }
    subsLast(id) {
        const idTr = this.gethInstance.web3.fromUtf8(id);
        return this.contract.subsLast.callAsync(idTr).then((result) => result.toString());
    }
    subsNext(id, tagId) {
        const idTr = this.gethInstance.web3.fromUtf8(id);
        return this.contract.subsNext.callAsync(idTr, tagId).then((result) => result.toString());
    }
    subsPrev(id, tagId) {
        const idTr = this.gethInstance.web3.fromUtf8(id);
        return this.contract.subsPrev.callAsync(idTr, tagId).then((result) => result.toString());
    }
    isSubscribed(id, tagName) {
        const idTr = this.gethInstance.web3.fromUtf8(id);
        return this.contract.isSubscribed.callAsync(idTr, tagName);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Subs;
//# sourceMappingURL=Subs.js.map