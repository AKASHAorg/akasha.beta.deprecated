"use strict";
const Promise = require('bluebird');
const settings_1 = require('./settings');
const geth_connector_1 = require('@akashaproject/geth-connector');
const current_profile_1 = require('../registry/current-profile');
let whisperIdentity;
const execute = Promise.coroutine(function* (data) {
    if (data.message.length > 128) {
        throw new Error("Max message length allowed is 128");
    }
    if (!whisperIdentity) {
        whisperIdentity = yield geth_connector_1.GethConnector.getInstance().web3.shh.newIdentityAsync();
    }
    const from = yield current_profile_1.default.execute();
    const payload = JSON.stringify({ message: data.message, from: from.akashaId });
    const post = yield geth_connector_1.GethConnector.getInstance().web3
        .shh
        .postAsync({
        from: whisperIdentity,
        topics: settings_1.TOPICS,
        payload: payload,
        priority: 500,
        ttl: 3600
    });
    return { post };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'post' };
//# sourceMappingURL=post.js.map