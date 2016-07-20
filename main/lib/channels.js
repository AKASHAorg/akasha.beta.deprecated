"use strict";
const crypto_1 = require('crypto');
const hashPath = (...path) => {
    const hash = crypto_1.createHash('sha256');
    path.forEach((segment) => {
        hash.update(segment);
    });
    return hash.digest('hex');
};
const channels = {
    geth: ['startService', 'stopService', 'restartService', 'startSyncing', 'syncUpdate'],
    ipfs: ['startService', 'stopService'],
    logger: ['gethInfo', 'stopGethInfo'],
    user: ['exists', 'login', 'logout', 'createCoinbase', 'faucetEther', 'registerProfile',
        'getProfileData', 'listEthAccounts', 'getBalance', 'getIpfsImage'],
    entry: ['publish']
};
const processes = ['server', 'client'];
const EVENTS = { server: {}, client: {} };
Object.keys(channels).forEach((attr) => {
    channels[attr].forEach((endpoint) => {
        processes.forEach((proc) => {
            if (!EVENTS[proc].hasOwnProperty(attr)) {
                EVENTS[proc][attr] = {};
            }
            EVENTS[proc][attr][endpoint] = hashPath(proc, attr, endpoint, new Date().getTime().toString());
        });
    });
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { server: EVENTS.server, client: EVENTS.client };
//# sourceMappingURL=channels.js.map