"use strict";
const BaseContract_1 = require('./BaseContract');
const Promise = require('bluebird');
const ethereumjs_util_1 = require('ethereumjs-util');
class Registry extends BaseContract_1.default {
    constructor(instance) {
        super();
        this.contract = Promise.promisifyAll(instance);
        this.contract.getById.callAsync = Promise.promisify(this.contract.getById.call);
        this.contract.getByAddr.callAsync = Promise.promisify(this.contract.getByAddr.call);
    }
    profileExists(username) {
        return this.contract
            .getById
            .callAsync(username);
    }
    getByAddress(address) {
        return this.contract
            .getByAddr
            .callAsync(address);
    }
    getMyProfile() {
        return this.contract
            .getMyProfileAsync();
    }
    getLocalProfiles() {
        let keyList;
        const profileList = [];
        return this.gethInstance
            .web3
            .eth
            .getAccountsAsync()
            .then((list) => {
            list.sort();
            const checkForProfile = list.map((val) => {
                return this.getByAddress(val);
            });
            keyList = list;
            return Promise.all(checkForProfile);
        })
            .then((addrList) => {
            addrList.forEach((val, index) => {
                const valTr = ethereumjs_util_1.unpad(val);
                if (valTr) {
                    profileList.push({ key: keyList[index], profile: val });
                }
            });
            keyList = null;
            return profileList;
        });
    }
    register(username, ipfsHash, gas = 90000) {
        const usernameTr = this.gethInstance.web3.fromUtf8(username);
        const ipfsHashTr = [ipfsHash.slice(0, 23), ipfsHash.slice(23)].map((v) => {
            return this.gethInstance.web3.fromUtf8(v);
        });
        return this.profileExists(usernameTr)
            .then((address) => {
            const exists = ethereumjs_util_1.unpad(address);
            if (exists) {
                throw new Error(`${username} already taken`);
            }
            if (ipfsHashTr.length !== 2) {
                throw new Error('Expected exactly 2 ipfs slices');
            }
            return this.estimateGas('register', usernameTr, ipfsHashTr)
                .then((estimatedGas) => {
                if (estimatedGas > gas) {
                    throw new Error(`Gas required: ${estimatedGas}, Gas provided: ${gas}`);
                }
                return this.extractData('register', usernameTr, ipfsHashTr, { gas: gas });
            });
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Registry;
//# sourceMappingURL=Registry.js.map