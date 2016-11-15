"use strict";
const Promise = require('bluebird');
const geth_connector_1 = require('@akashaproject/geth-connector');
const execute = Promise.coroutine(function* (data) {
    const blockNr = (data.blockNr) ? data.blockNr : yield geth_connector_1.GethConnector.getInstance().web3.eth.getBlockNumberAsync();
    global['profilesFilter'] = { profiles: data.profiles, blockNr: blockNr };
    return { done: true, watching: global['profilesFilter'] };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'setFilter' };
//# sourceMappingURL=set-filter.js.map