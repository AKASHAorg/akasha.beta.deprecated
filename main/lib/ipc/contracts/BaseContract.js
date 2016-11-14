"use strict";
const geth_connector_1 = require('@akashaproject/geth-connector');
const Promise = require('bluebird');
class BaseContract {
    constructor() {
        this.gethInstance = geth_connector_1.GethConnector.getInstance();
    }
    flattenIpfs(ipfsHash) {
        return this.gethInstance.web3.toUtf8(ipfsHash[0]) +
            this.gethInstance.web3.toUtf8(ipfsHash[1]);
    }
    splitIpfs(ipfsHash) {
        const offset = Math.floor(ipfsHash.length / 2);
        return [
            this.gethInstance.web3.fromUtf8(ipfsHash.slice(0, offset)),
            this.gethInstance.web3.fromUtf8(ipfsHash.slice(offset))
        ];
    }
    getContract() {
        return this.contract;
    }
    extractData(method, ...params) {
        const payload = this.contract[method].request(...params);
        return payload.params[0];
    }
    estimateGas(method, ...params) {
        return new Promise((resolve, reject) => {
            this.contract[method]
                .estimateGas(...params, (err, gas) => {
                if (err) {
                    return reject(err);
                }
                return resolve(gas);
            });
        });
    }
    evaluateData(method, gas, ...params) {
        return this.estimateGas(method, ...params).then((estimatedGas) => {
            if (estimatedGas > gas) {
                throw new Error(`${method} GAS => { required: ${estimatedGas}, provided: ${gas} }`);
            }
            console.log('estimated gas for', method, estimatedGas);
            return this.extractData(method, ...params, { gas });
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BaseContract;
//# sourceMappingURL=BaseContract.js.map