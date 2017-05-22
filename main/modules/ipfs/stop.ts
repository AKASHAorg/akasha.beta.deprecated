import * as Promise from 'bluebird';
import { IpfsConnector } from '@akashaproject/ipfs-connector';

const execute = Promise.coroutine(function*() {
    return IpfsConnector.getInstance().stop().then(() => {});
});

export default { execute, name: 'stopService' };