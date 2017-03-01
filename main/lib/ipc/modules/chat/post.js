"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const settings_1 = require("./settings");
const geth_connector_1 = require("@akashaproject/geth-connector");
const current_profile_1 = require("../registry/current-profile");
exports.whisperIdentity = {
    from: ''
};
const execute = Promise.coroutine(function* (data) {
    if (data.message.length > 128) {
        throw new Error("Max message length allowed is 128");
    }
    if (!exports.whisperIdentity.from) {
        exports.whisperIdentity.from = yield geth_connector_1.GethConnector.getInstance().web3.shh.newIdentityAsync();
    }
    const topic = settings_1.default.getActive();
    const ttl = (settings_1.default.isDefaultActive()) ? '0x7080' : '0x15180';
    const from = yield current_profile_1.default.execute();
    const payload = geth_connector_1.GethConnector.getInstance().web3
        .fromUtf8(JSON.stringify({
        message: data.message,
        akashaId: from.akashaId
    }));
    const post = yield geth_connector_1.GethConnector.getInstance().web3
        .shh
        .postAsync({
        from: exports.whisperIdentity.from,
        topics: [topic],
        payload: payload,
        ttl: ttl
    });
    return { post, topic: geth_connector_1.GethConnector.getInstance().web3.toUtf8(topic) };
});
exports.default = { execute, name: 'post' };
//# sourceMappingURL=post.js.map