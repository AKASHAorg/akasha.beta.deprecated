"use strict";
const crypto_1 = require('crypto');
const os_1 = require('os');
const hashPath = (...path) => {
    const hash = crypto_1.createHash('sha256');
    path.forEach((segment) => {
        hash.update(segment);
    });
    return hash.digest('hex');
};
const channels = {
    auth: ['manager', 'login', 'logout', 'requestEther', 'generateEthKey', 'getLocalIdentities'],
    tags: ['manager', 'create', 'exists', 'getTagId', 'getTagAt', 'isSubscribed', 'subscribe',
        'unsubscribe', 'getSubPosition'],
    entry: ['manager', 'publish', 'update', 'upvote', 'downvote', 'isOpenedToVotes', 'getVoteOf',
        'getVoteEndDate', 'getScore'],
    comments: ['manager', 'publish', 'update', 'upvote', 'downvote', 'getScore'],
    geth: ['manager', 'options', 'startService', 'stopService', 'restartService', 'syncStatus', 'logs', 'status'],
    ipfs: ['manager', 'startService', 'stopService', 'status', 'resolve', 'getConfig', 'setPorts', 'getPorts'],
    profile: ['manager', 'getProfileData', 'getMyBalance', 'getIpfs', 'unregister'],
    registry: ['manager', 'profileExists', 'registerProfile', 'getCurrentProfile', 'getByAddress'],
    tx: ['manager', 'addToQueue', 'emitMined', 'listenMined'],
};
const processes = ['server', 'client'];
const mem = os_1.totalmem().toLocaleString();
const EVENTS = { client: {}, server: {} };
Object.keys(channels).forEach((attr) => {
    channels[attr].forEach((endpoint) => {
        processes.forEach((proc) => {
            if (!EVENTS[proc].hasOwnProperty(attr)) {
                EVENTS[proc][attr] = {};
            }
            EVENTS[proc][attr][endpoint] = hashPath(proc, attr, mem, endpoint);
        });
    });
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { client: EVENTS.client, server: EVENTS.server };
//# sourceMappingURL=channels.js.map