import { createHash } from 'crypto';
import { totalmem } from 'os';
import set = Reflect.set;
const hashPath = (...path: string[]) => {
    const hash = createHash('sha256');
    path.forEach((segment) => {
        hash.update(segment);
    });
    return hash.digest('hex');
};
const channels = {

    geth: ['manager', 'options', 'startService', 'stopService', 'restartService', 'syncStatus', 'logs', 'status'],

    ipfs: ['manager', 'startService', 'stopService', 'status', 'resolve'],

    auth: ['manager', 'login', 'logout', 'requestEther', 'generateEthKey', 'getLocalIdentities'],

    profile: ['manager', 'getProfileData', 'getMyBalance'],

    registry: ['manager', 'profileExists', 'registerProfile', 'getCurrentProfile', 'getByAddress'],

    entry: ['manager', 'publish'],

    tx: ['manager', 'addToQueue', 'emitMined']
};

const processes = ['server', 'client'];
const mem = totalmem().toLocaleString();
const EVENTS: any = { server: {}, client: {} };
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
export default { server: EVENTS.server, client: EVENTS.client };
