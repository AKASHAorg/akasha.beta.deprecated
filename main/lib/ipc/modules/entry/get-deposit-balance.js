"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const index_1 = require("../../contracts/index");
const geth_connector_1 = require("@akashaproject/geth-connector");
const execute = Promise.coroutine(function* (data) {
    const entryFund = yield index_1.constructed.instance.entries.getEntryFund(data.entryId);
    const weiBalance = yield geth_connector_1.GethConnector.getInstance().web3.eth.getBalanceAsync(entryFund);
    const ethBalance = (geth_connector_1.GethConnector.getInstance().web3.fromWei(weiBalance, 'ether')).toString(10);
    return { balance: ethBalance, entryId: data.entryId };
});
exports.default = { execute, name: 'getDepositBalance' };
//# sourceMappingURL=get-deposit-balance.js.map