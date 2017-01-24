"use strict";
const settings_1 = require('./settings');
const Promise = require('bluebird');
const geth_connector_1 = require('@akashaproject/geth-connector');
const execute = Promise.coroutine(function* (data) {
    if (!data.channels || !data.channels.length) {
        throw new Error('Must provide at least a channel');
    }
    const maxChannels = 10;
    data.channels.forEach((chan) => {
        if (settings_1.default.TOPICS.size === maxChannels) {
            throw new Error(`Max ${maxChannels} channels reached`);
        }
        settings_1.default.TOPICS.add(geth_connector_1.GethConnector.getInstance().web3.fromUtf8(chan));
    });
    return { channels: data.channels, numChannels: settings_1.default.TOPICS.size, maxChannels };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'join' };
//# sourceMappingURL=join.js.map