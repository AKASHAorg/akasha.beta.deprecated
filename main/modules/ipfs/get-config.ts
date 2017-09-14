import * as Promise from 'bluebird';
import { IpfsConnector } from '@akashaproject/ipfs-connector';

const execute = Promise.coroutine(function* () {
    return {
        apiPort: IpfsConnector.getInstance().options.apiAddress.split('/').pop(),
        storagePath: IpfsConnector.getInstance().options.extra.env.IPFS_PATH
    };
});

export default { execute, name: 'getConfig' };
