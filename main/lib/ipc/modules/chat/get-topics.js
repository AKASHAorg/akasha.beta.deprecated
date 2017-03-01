"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = require("./settings");
const Promise = require("bluebird");
const geth_connector_1 = require("@akashaproject/geth-connector");
const execute = Promise.coroutine(function* () {
    const topics = [];
    for (let topic of settings_1.default.TOPICS) {
        topics.push(geth_connector_1.GethConnector.getInstance().web3.toUtf8(topic));
    }
    return Promise.resolve({ channels: topics });
});
exports.default = { execute, name: 'getCurrentChannels' };
//# sourceMappingURL=get-topics.js.map