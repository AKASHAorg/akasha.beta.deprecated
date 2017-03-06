import { createHash } from 'crypto';
import { hostname } from 'os';
const hashPath = (...path: string[]) => {
    const hash = createHash('sha256');
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
        'editEntry', 'pin', 'followingStreamIterator', 'allStreamIterator'],

    comments: ['getComment', 'comment', 'commentsCount', 'removeComment', 'commentsIterator'],

    geth: ['options', 'startService', 'stopService', 'restartService', 'syncStatus', 'logs', 'status'],

    ipfs: ['startService', 'stopService', 'status', 'resolve', 'getConfig', 'setPorts', 'getPorts', 'logs'],

    profile: ['getBalance', 'followProfile', 'getFollowersCount', 'getFollowingCount', 'getProfileData',
        'unFollowProfile', 'updateProfileData', 'followersIterator', 'followingIterator', 'isFollower', 'isFollowing',
        'getFollowingList', 'getProfileList', 'tip'],

    registry: ['fetchRegistered', 'addressOf', 'checkIdFormat', 'getCurrentProfile', 'profileExists', 'registerProfile',
        'getByAddress', 'unregister'],

    notifications: ['me', 'feed', 'setFilter', 'excludeFilter', 'includeFilter', 'mention'],

    tx: ['addToQueue', 'emitMined'],

    licenses: ['getLicenceById', 'getLicenses'],

    chat: ['fetch', 'post', 'join', 'leave', 'getCurrentChannels'],

    search: ['handshake', 'query'],

    utils: ['backupKeys']
};

const processes = ['server', 'client'];
const name = hostname();
const EVENTS: any = { client: {}, server: {} };
Object.keys(channels).forEach((attr) => {
    channels[attr].forEach((endpoint: string) => {
        processes.forEach((proc) => {
            if (!EVENTS[proc].hasOwnProperty(attr)) {
                EVENTS[proc][attr] = { manager: hashPath(proc, attr, name, 'manager') };
            }
            EVENTS[proc][attr][endpoint] = hashPath(proc, attr, name, endpoint);
        });
    });
});
export default { client: EVENTS.client, server: EVENTS.server };

