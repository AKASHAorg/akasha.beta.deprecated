"use strict";
const Promise = require('bluebird');
const geth_connector_1 = require('@akashaproject/geth-connector');
exports.filter = {
    _address: {},
    _blockNr: 0,
    setBlockNr: (bNr) => {
        this._blockNr = bNr;
    },
    setAddress: (addresses) => {
        this._address = addresses;
    },
    hasAddress: (qAddress) => {
        return this._address.hasOwnProperty(qAddress);
    },
    getBlockNr: () => {
        return this._blockNr;
    }
};
const execute = Promise.coroutine(function* (data) {
    const blockNr = (data.blockNr) ? data.blockNr : yield geth_connector_1.GethConnector.getInstance().web3.eth.getBlockNumberAsync();
    let objectFilter = {};
    exports.filter.setBlockNr(blockNr);
    data.profiles.forEach((profileAddress) => {
        Object.defineProperty(objectFilter, profileAddress, { value: true });
    });
    exports.filter.setAddress(objectFilter);
    objectFilter = null;
    return { done: true, watching: data.profiles };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'setFilter' };
//# sourceMappingURL=set-filter.js.map