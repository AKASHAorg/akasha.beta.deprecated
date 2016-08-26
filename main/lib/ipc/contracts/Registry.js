"use strict";
const Promise = require('bluebird');
const BaseContract_1 = require('./BaseContract');
class Registry extends BaseContract_1.default {
    constructor(instance) {
        super();
        this.contract = Promise.promisifyAll(instance);
        this.contract.getById.callAsync = Promise.promisify(this.contract.getById.call);
        this.contract.getByAddr.callAsync = Promise.promisify(this.contract.getByAddr.call);
    }
    profileExists(username) {
        const transformed = this.gethInstance.web3.fromUtf8(username);
        return this.contract
            .getById
            .callAsync(transformed);
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
        const profileList = [[]];
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
                val = this.gethInstance.web3.toUtf8(val);
                if (val !== '') {
                    profileList.push([keyList[index], val]);
                }
            });
            keyList = null;
            return profileList;
        });
    }
    register(username, ipfsHash, gas = 90000) {
        const usernameTr = this.gethInstance.web3.fromUtf8(username);
        const ipfsHashTr = ipfsHash.map((v) => {
            return this.gethInstance.web3.fromUtf8(v);
        });
        return this.profileExists(usernameTr)
            .then((address) => {
            const exists = this.gethInstance.web3.toUtf8(address);
            if (exists) {
                throw new Error(`${username} already taken`);
            }
            if (ipfsHashTr.length !== 2) {
                throw new Error('Expected exactly 2 ipfs slices');
            }
            const estimatedGas = this.estimateGas('register', usernameTr, ipfsHashTr);
            if (estimatedGas > gas) {
                throw new Error(`Gas required: ${estimatedGas}, Gas provided: ${gas}`);
            }
            return this.extractData('register', usernameTr, ipfsHashTr, { gas: gas });
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Registry;
//# sourceMappingURL=Registry.js.map