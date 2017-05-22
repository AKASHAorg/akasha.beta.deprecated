import * as Promise from 'bluebird';
import { IpfsConnector } from '@akashaproject/ipfs-connector';

const execute = Promise.coroutine(function*(data: IpfsStartRequest) {
    if (IpfsConnector.getInstance().serviceStatus.process) {
        throw new Error('IPFS is already running');
    }
    if (data.storagePath) {
        IpfsConnector.getInstance().setIpfsFolder(data.storagePath);
    }
    return IpfsConnector.getInstance().start().then(() => {});
});

export default { execute, name: 'startService' };