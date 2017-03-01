"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const ramda_1 = require("ramda");
const geth_connector_1 = require("@akashaproject/geth-connector");
const settings_1 = require("../../config/settings");
const Auth_1 = require("../auth/Auth");
const post_1 = require("../chat/post");
const execute = Promise.coroutine(function* (data) {
    const timeout = (data.timeout) ? data.timeout : settings_1.handshakeTimeout;
    const seed = yield Auth_1.randomBytesAsync(32);
    const message = geth_connector_1.GethConnector.getInstance()
        .web3
        .sha3(seed.toString('hex'), { encoding: 'hex' });
    const jsonMessage = { message: message, date: (new Date()).toJSON() };
    if (!post_1.whisperIdentity.from) {
        post_1.whisperIdentity.from = yield geth_connector_1.GethConnector.getInstance().web3.shh.newIdentityAsync();
    }
    const payload = geth_connector_1.GethConnector.getInstance().web3
        .fromUtf8(JSON.stringify(jsonMessage));
    const ttl = geth_connector_1.GethConnector.getInstance().web3
        .fromDecimal(timeout);
    const init = yield geth_connector_1.GethConnector.getInstance().web3
        .shh
        .postAsync({
        from: post_1.whisperIdentity.from,
        topics: [settings_1.HANDSHAKE_REQUEST],
        payload: payload,
        ttl: ttl
    });
    if (!init) {
        throw new Error('Could not send handshake request.');
    }
    const response = yield Promise.delay(timeout * 1000).then(() => {
        return Promise.fromCallback((cb) => {
            geth_connector_1.GethConnector.getInstance()
                .web3
                .shh
                .filter({ topics: [settings_1.HANDSHAKE_RESPONSE], to: post_1.whisperIdentity.from })
                .get(cb);
        });
    });
    if (!response.length) {
        throw new Error('Search service timed out.');
    }
    for (let i = 0; i < response.length; i++) {
        if (response[i].hasOwnProperty('payload')) {
            if (ramda_1.equals(payload, response[i].payload)) {
                settings_1.generalSettings.set(settings_1.SEARCH_PROVIDER, response[i].from);
                settings_1.generalSettings.set(settings_1.HANDSHAKE_DONE, true);
                break;
            }
        }
    }
    if (!settings_1.generalSettings.get(settings_1.HANDSHAKE_DONE)) {
        throw new Error('Could not handshake.');
    }
    return { searchService: init };
});
exports.default = { execute, name: 'handshake' };
//# sourceMappingURL=handshake.js.map