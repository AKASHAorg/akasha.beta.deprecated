import { createHash } from 'crypto';
import { totalmem } from 'os';
const hashPath = (...path: string[]) => {
    const hash = createHash('sha256');
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
    'getVoteEndDate', 'getScore', 'getEntriesCount', 'getEntryOf', 'getEntry'],

    comments: ['manager', 'publish', 'update', 'upvote', 'downvote', 'getScore'],

    geth: ['manager', 'options', 'startService', 'stopService', 'restartService', 'syncStatus', 'logs', 'status'],

    ipfs: ['manager', 'startService', 'stopService', 'status', 'resolve', 'getConfig', 'setPorts', 'getPorts'],

    profile: ['manager', 'getProfileData', 'getMyBalance', 'getIpfs', 'unregister', 'follow', 'getFollowersCount',
    'getFollowingCount', 'getFollowers', 'getFollowing'],

    registry: ['manager', 'profileExists', 'registerProfile', 'getCurrentProfile', 'getByAddress'],

    tx: ['manager', 'addToQueue', 'emitMined', 'listenMined'],
};

const processes = ['server', 'client'];
const mem = totalmem().toLocaleString();
const EVENTS: any = { client: {}, server: {} };
Object.keys(channels).forEach((attr) => {
    channels[attr].forEach((endpoint: string) => {
        processes.forEach((proc) => {
            if (!EVENTS[proc].hasOwnProperty(attr)) {
                EVENTS[proc][attr] = {};
            }
            EVENTS[proc][attr][endpoint] = hashPath(proc, attr, mem, endpoint);
        });
    });
});
export default { client: EVENTS.client, server: EVENTS.server };

