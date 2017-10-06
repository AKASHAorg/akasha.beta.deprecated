import * as Promise from 'bluebird';
import { IpfsConnector } from '@akashaproject/ipfs-connector';

const execute = Promise.coroutine(function* () {
    return Promise.fromCallback((cb) => {
        return IpfsConnector.getInstance().logger.query({ start: 0, limit: 10, order: 'desc' }, cb);
    });
});

export default { execute, name: 'logs' };
