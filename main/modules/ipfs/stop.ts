import * as Promise from 'bluebird';
import { IpfsConnector } from '@akashaproject/ipfs-connector';

const execute = Promise.coroutine(function*() {
    return IpfsConnector.getInstance().stop();
});

export default { execute, name: 'stopService' };