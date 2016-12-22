"use strict";
const Promise = require('bluebird');
const index_1 = require('../../contracts/index');
const geth_connector_1 = require('@akashaproject/geth-connector');
const execute = Promise.coroutine(function* (data) {
    const balanceAddress = yield index_1.constructed.instance.entries.getEntryFund(data.entryId);
    if (!balanceAddress) {
        return { balance: 'claimed', unit: '', entryId: data.entryId };
    }
    const weiAmount = yield geth_connector_1.GethConnector.getInstance().web3.eth.getBalanceAsync(balanceAddress);
    const balance = geth_connector_1.GethConnector.getInstance().web3.fromWei(weiAmount, 'ether');
    return { balance: balance.toString(10), unit: 'ether', entryId: data.entryId };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'getEntryBalance' };
//# sourceMappingURL=get-entry-balance.js.map