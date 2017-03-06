"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseContract_1 = require("./BaseContract");
const Promise = require("bluebird");
class Profile extends BaseContract_1.default {
    constructor(instance) {
        super();
        this.contract = instance;
    }
    getIpfs(address) {
        const profile = this.contract.at(address);
        const first = Promise.fromCallback((cb) => {
            profile._hash.call(0, cb);
        });
        const second = Promise.fromCallback((cb) => {
            profile._hash.call(1, cb);
        });
        return Promise.all([first, second]).then((parts) => this.flattenIpfs(parts));
    }
    getId(address) {
        const profile = this.contract.at(address);
        return Promise.fromCallback((cb) => {
            profile._id.call(cb);
        }).then((id) => this.gethInstance.web3.toUtf8(id));
    }
    updateHash(hash, address, gas) {
        const hashTr = this.splitIpfs(hash);
        const profile = this.contract.at(address);
        const extracted = profile.setHash.request(hashTr, { gas });
        return Promise.resolve(extracted.params[0]);
    }
    sendTip(receiver, value, unit = 'ether', gas = 500000) {
        const profile = this.contract.at(receiver);
        const weiValue = this.gethInstance.web3.toWei(value, unit);
        const extract = profile['sendTip'].request({ gas, value: weiValue });
        return Promise.resolve(extract.params[0]);
    }
}
exports.default = Profile;
//# sourceMappingURL=Profile.js.map