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
    tags: ['checkFormat', 'create', 'tagIterator', 'tagSubIterator', 'exists', 'getTagsCreated', 'subsCount',
        'subscribe', 'getTagId', 'getTagName', 'unSubscribe', 'isSubscribed', 'searchTag'],
    entry: ['getProfileEntriesCount', 'getTagEntriesCount', 'isActive', 'getEntry', 'publish', 'update', 'canClaim', 'claim',
        'downvote', 'getScore', 'getDepositBalance', 'upvote', 'voteCost', 'voteCount', 'entryTagIterator',
        'entryProfileIterator', 'votesIterator', 'getEntriesStream', 'getVoteOf', 'getEntryBalance', 'getEntryList',
        'editEntry', 'pin', 'followingStreamIterator'],
    comments: ['getComment', 'comment', 'commentsCount', 'removeComment', 'commentsIterator'],
    geth: ['options', 'startService', 'stopService', 'restartService', 'syncStatus', 'logs', 'status'],
    ipfs: ['startService', 'stopService', 'status', 'resolve', 'getConfig', 'setPorts', 'getPorts', 'logs'],
    profile: ['getBalance', 'followProfile', 'getFollowersCount', 'getFollowingCount', 'getProfileData',
        'unFollowProfile', 'updateProfileData', 'followersIterator', 'followingIterator', 'isFollower', 'isFollowing',
        'getFollowingList', 'getProfileList', 'tip'],
    registry: ['fetchRegistered', 'addressOf', 'checkIdFormat', 'getCurrentProfile', 'profileExists', 'registerProfile',
        'getByAddress', 'unregister'],
    notifications: ['me', 'feed', 'setFilter', 'excludeFilter', 'includeFilter'],
    tx: ['addToQueue', 'emitMined'],
    licenses: ['getLicenceById', 'getLicenses'],
    chat: ['fetch', 'post', 'join', 'leave', 'getCurrentChannels']
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