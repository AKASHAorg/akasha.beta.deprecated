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
    geth: ['manager', 'options', 'startService', 'stopService', 'restartService', 'syncStatus', 'logs', 'status'],
    ipfs: ['manager', 'startService', 'stopService', 'status'],
    auth: ['manager', 'login', 'logout', 'requestEther', 'generateEthKey', 'getLocalIdentities'],
    user: ['manager', 'exists', 'registerProfile', 'getProfileData', 'getBalance', 'getIpfsImage'],
    entry: ['manager', 'publish'],
    tx: ['addToQueue', 'listen']
};
const processes = ['server', 'client'];
const mem = os_1.totalmem().toLocaleString();
const EVENTS = { server: {}, client: {} };
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
exports.default = { server: EVENTS.server, client: EVENTS.client };
//# sourceMappingURL=channels.js.map