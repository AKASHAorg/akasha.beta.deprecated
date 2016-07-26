import { createHash } from 'crypto';
import set = Reflect.set;
const hashPath = (...path: string[]) => {
    const hash = createHash('sha256');
    path.forEach((segment) => {
        hash.update(segment);
    });
    return hash.digest('hex');
};
const channels = {

    geth: ['manager', 'startService', 'stopService', 'restartService', 'syncStatus', 'logs'],

    ipfs: ['manager', 'startService', 'stopService'],

    user: ['manager', 'exists', 'login', 'logout', 'createCoinbase', 'faucetEther', 'registerProfile',
        'getProfileData', 'listEthAccounts', 'getBalance', 'getIpfsImage'],

    entry: ['manager', 'publish']
};

const processes = ['server', 'client'];
const EVENTS: any = { server: {}, client: {} };
Object.keys(channels).forEach((attr) => {
    channels[attr].forEach((endpoint: string) => {
        processes.forEach((proc) => {
            if (!EVENTS[proc].hasOwnProperty(attr)) {
                EVENTS[proc][attr] = {};
            }
            EVENTS[proc][attr][endpoint] = hashPath(proc, attr, endpoint);
        });
    });
});
export default { server: EVENTS.server, client: EVENTS.client };

