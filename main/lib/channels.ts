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

    auth: ['login', 'logout', 'requestEther', 'generateEthKey', 'getLocalIdentities'],

    tags: ['create', 'exists', 'getTagId', 'getTagName', 'getTagsCreated', 'checkFormat'],

    entry: ['publish', 'update', 'upvote', 'downvote', 'isOpenedToVotes', 'getVoteOf',
        'getVoteEndDate', 'getScore', 'getEntriesCount', 'getEntryOf', 'getEntry', 'getEntriesCreated', 'getVotesEvent'],

    comments: ['publish', 'update', 'upvote', 'downvote', 'getScore', 'getCount', 'getCommentAt'],

    geth: ['options', 'startService', 'stopService', 'restartService', 'syncStatus', 'logs', 'status'],

    ipfs: ['startService', 'stopService', 'status', 'resolve', 'getConfig', 'setPorts', 'getPorts'],

    profile: ['getProfileData', 'updateProfileData', 'getBalance', 'followProfile', 'unFollowProfile',
        'getFollowersCount', 'getFollowingCount'],

    registry: ['profileExists', 'registerProfile', 'unregister', 'getCurrentProfile', 'getByAddress', 'fetchRegistered'],

    tx: ['addToQueue', 'emitMined'],

    licenses: ['getLicenceById', 'getLicenses']
};

const processes = ['server', 'client'];
const mem = totalmem().toLocaleString();
const EVENTS: any = { client: {}, server: {} };
Object.keys(channels).forEach((attr) => {
    channels[attr].forEach((endpoint: string) => {
        processes.forEach((proc) => {
            if (!EVENTS[proc].hasOwnProperty(attr)) {
                EVENTS[proc][attr] = { manager: hashPath(proc, attr, mem, 'manager') };
            }
            EVENTS[proc][attr][endpoint] = hashPath(proc, attr, mem, endpoint);
        });
    });
});
export default { client: EVENTS.client, server: EVENTS.server };

