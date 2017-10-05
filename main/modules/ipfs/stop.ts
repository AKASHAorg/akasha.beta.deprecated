import * as Promise from 'bluebird';
import { IpfsConnector } from '@akashaproject/ipfs-connector';

const execute = Promise.coroutine(function* () {
    yield IpfsConnector.getInstance().stop();
    return {};
});

export default { execute, name: 'stopService' };
