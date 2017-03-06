"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = require("./settings");
const Promise = require("bluebird");
const geth_connector_1 = require("@akashaproject/geth-connector");
const execute = Promise.coroutine(function* (data) {
    if (!data.channels || !data.channels.length) {
        throw new Error('Must provide at least a channel');
    }
    data.channels.forEach((chan) => {
        settings_1.default.TOPICS.delete(geth_connector_1.GethConnector.getInstance().web3.fromUtf8(chan));
    });
    return { channels: data.channels, numChannels: settings_1.default.TOPICS.size };
});
exports.default = { execute, name: 'leave' };
//# sourceMappingURL=leave.js.map