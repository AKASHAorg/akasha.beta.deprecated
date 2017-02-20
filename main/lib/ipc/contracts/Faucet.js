"use strict";
const BaseContract_1 = require("./BaseContract");
const Promise = require("bluebird");
class Faucet extends BaseContract_1.default {
    constructor(instance) {
        super();
        this.contract = instance;
        this.contract.getLastClaim.callAsync = Promise.promisify(this.contract.getLastClaim.call);
        this.contract.canClaim.callAsync = Promise.promisify(this.contract.canClaim.call);
    }
    claim(gas = 2000000) {
        return this.evaluateData('claim', gas);
    }
    getLastClaim(idAddress) {
        this.contract.getLastClaim.callAsync(idAddress).then((result) => result.toString());
    }
    canClaim(idAddress) {
        this.contract.canClaim.callAsync(idAddress);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Faucet;
//# sourceMappingURL=Faucet.js.map