"use strict";
const Promise = require("bluebird");
const geth_connector_1 = require("@akashaproject/geth-connector");
const execute = Promise.coroutine(function* (data) {
    const etherBase = (data.etherBase) ? data.etherBase : geth_connector_1.GethConnector.getInstance().web3.eth.defaultAccount;
    const unit = (data.unit) ? data.unit : 'ether';
    const weiAmount = yield geth_connector_1.GethConnector.getInstance().web3.eth.getBalanceAsync(etherBase);
    const balance = geth_connector_1.GethConnector.getInstance().web3.fromWei(weiAmount, unit);
    return { balance: balance.toString(10), unit, etherBase };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'getBalance' };
//# sourceMappingURL=current-balance.js.map