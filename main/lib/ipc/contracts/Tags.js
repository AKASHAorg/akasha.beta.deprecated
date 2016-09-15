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
                .addAsync(tag, { gas: gas });
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Tags;
//# sourceMappingURL=Tags.js.map