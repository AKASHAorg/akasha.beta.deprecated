"use strict";
const Promise = require('bluebird');
const settings_1 = require('./settings');
const geth_connector_1 = require('@akashaproject/geth-connector');
let chat;
const execute = Promise.coroutine(function* (data, cb) {
    if (data.stop && chat) {
        chat.stopWatching(() => {
        });
        return { post: null };
    }
    chat = geth_connector_1.GethConnector.getInstance().web3.shh.filter({ topics: settings_1.TOPICS });
    chat.watch(function (err, data) {
        cb(err, JSON.parse(data));
    });
    return { post: true };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'fetch' };
//# sourceMappingURL=fetch.js.map