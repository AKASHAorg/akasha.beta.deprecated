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
    geth: ['manager', 'startService', 'stopService', 'restartService', 'syncStatus'],
    ipfs: ['manager', 'startService', 'stopService'],
    logger: ['manager', 'gethInfo', 'stopGethInfo'],
    user: ['manager', 'exists', 'login', 'logout', 'createCoinbase', 'faucetEther', 'registerProfile',
        'getProfileData', 'listEthAccounts', 'getBalance', 'getIpfsImage'],
    entry: ['manager', 'publish']
};
const processes = ['server', 'client'];
const EVENTS = { server: {}, client: {} };
Object.keys(channels).forEach((attr) => {
    channels[attr].forEach((endpoint) => {
        processes.forEach((proc) => {
            if (!EVENTS[proc].hasOwnProperty(attr)) {
                EVENTS[proc][attr] = {};
            }
            EVENTS[proc][attr][endpoint] = hashPath(proc, attr, endpoint);
        });
    });
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { server: EVENTS.server, client: EVENTS.client };
//# sourceMappingURL=channels.js.map