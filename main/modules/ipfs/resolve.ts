import * as Promise from 'bluebird';
import { IpfsConnector } from '@akashaproject/ipfs-connector';

const execute = Promise.coroutine(function*(data: IpfsResolveRequest) {
    return IpfsConnector.getInstance().api.get(data.hash);
});

export default { execute, name: 'resolve' };