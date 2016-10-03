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
    auth: ['login', 'logout', 'requestEther', 'generateEthKey', 'getLocalIdentities'],
    tags: ['create', 'exists', 'getTagId', 'getTagAt', 'isSubscribed', 'subscribe',
        'unsubscribe', 'getSubPosition', 'getTagsFrom'],
    entry: ['publish', 'update', 'upvote', 'downvote', 'isOpenedToVotes', 'getVoteOf',
        'getVoteEndDate', 'getScore', 'getEntriesCount', 'getEntryOf', 'getEntry'],
    comments: ['publish', 'update', 'upvote', 'downvote', 'getScore'],
    geth: ['options', 'startService', 'stopService', 'restartService', 'syncStatus', 'logs', 'status'],
    ipfs: ['startService', 'stopService', 'status', 'resolve', 'getConfig', 'setPorts', 'getPorts'],
    profile: ['getProfileData', 'getMyBalance', 'getIpfs', 'unregister', 'follow', 'getFollowersCount',
        'getFollowingCount', 'getFollowers', 'getFollowing'],
    registry: ['profileExists', 'registerProfile', 'getCurrentProfile', 'getByAddress'],
    tx: ['addToQueue', 'emitMined'],
};
const processes = ['server', 'client'];
const mem = os_1.totalmem().toLocaleString();
const EVENTS = { client: {}, server: {} };
Object.keys(channels).forEach((attr) => {
    channels[attr].forEach((endpoint) => {
        processes.forEach((proc) => {
            if (!EVENTS[proc].hasOwnProperty(attr)) {
                EVENTS[proc][attr] = { manager: hashPath(proc, attr, mem, 'manager') };
            }
            EVENTS[proc][attr][endpoint] = hashPath(proc, attr, mem, endpoint);
        });
    });
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { client: EVENTS.client, server: EVENTS.server };
//# sourceMappingURL=channels.js.map