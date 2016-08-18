"use strict";
const geth_connector_1 = require('@akashaproject/geth-connector');
class BaseContract {
    constructor() {
        this.gethInstance = geth_connector_1.GethConnector.getInstance();
    }
    flattenIpfs(ipfsHash) {
        return this.gethInstance.web3.toUtf8(`${ipfsHash[0]}${ipfsHash[1]}`);
    }
    getContract() {
        return this.contract;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BaseContract;
//# sourceMappingURL=BaseContract.js.map