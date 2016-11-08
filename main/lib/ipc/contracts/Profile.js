"use strict";
const BaseContract_1 = require('./BaseContract');
const Promise = require('bluebird');
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
    getTippingAddress(address) {
        return new Promise((resolve, reject) => {
            this.contract
                .at(address)
                .getCollector
                .call((err, data) => {
                if (err) {
                    return reject(err);
                }
                return resolve(data);
            });
        });
    }
    updateHash(hash, address, gas) {
        const hashTr = this.splitIpfs(hash);
        const extracted = this.contract.at(address).setHash.request(hashTr, { gas });
        return Promise.resolve(extracted.params[0]);
    }
    setTippingAddress(address, tippingAddress, gas) {
        const extracted = this.contract
            .at(address)
            .setEthAddress
            .request(tippingAddress, { gas });
        return Promise.resolve(extracted.params[0]);
    }
    unregister(address, gas) {
        const extracted = this.contract
            .at(address)
            .destroy
            .request({ gas });
        return Promise.resolve(extracted.params[0]);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Profile;
//# sourceMappingURL=Profile.js.map