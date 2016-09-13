"use strict";
const Promise = require('bluebird');
const BaseContract_1 = require('./BaseContract');
class Profile extends BaseContract_1.default {
    constructor(instance) {
        super();
        this.contract = instance;
    }
    getIpfs(address) {
        return new Promise((resolve, reject) => {
            this.contract
                .at(address)
                .getIpfs
                .call((err, hash) => {
                if (err) {
                    return reject(err);
                }
                return resolve(this.flattenIpfs(hash));
            });
        });
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
        const ipfsHashTr = hash.map((v) => {
            return this.gethInstance.web3.fromUtf8(v);
        });
        return new Promise((resolve, reject) => {
            if (hash.length !== 2) {
                return reject(new Error('Expected exactly 2 ipfs slices'));
            }
            this.contract
                .at(address)
                .setHash(ipfsHashTr, { gas: gas }, (err, tx) => {
                if (err) {
                    return reject(err);
                }
                return resolve(tx);
            });
        });
    }
    setTippingAddress(address, tippingAddress, gas) {
        return new Promise((resolve, reject) => {
            this.contract
                .at(address)
                .setEthAddress(tippingAddress, { gas: gas }, (err, tx) => {
                if (err) {
                    return reject(err);
                }
                return resolve(tx);
            });
        });
    }
    unregister(address, gas) {
        return new Promise((resolve, reject) => {
            this.contract
                .at(address)
                .destroy({ gas: gas }, (err, tx) => {
                if (err) {
                    return reject(err);
                }
                return resolve(tx);
            });
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Profile;
//# sourceMappingURL=Profile.js.map