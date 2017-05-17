import * as Promise from 'bluebird';
import { IpfsConnector } from '@akashaproject/ipfs-connector';

const execute = Promise.coroutine(function*(data: IpfsSetConfigRequest) {
    return IpfsConnector.getInstance().setPorts(data.ports, data.restart);
});

export default { execute, name: 'setPorts' };