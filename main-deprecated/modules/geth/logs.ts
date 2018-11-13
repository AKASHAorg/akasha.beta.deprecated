import * as Promise from 'bluebird';
import { GethConnector } from '@akashaproject/geth-connector';

const execute = Promise.coroutine(function* () {
    return Promise.fromCallback((cb) => {
        return GethConnector.getInstance().logger.query({ start: 0, limit: 20, order: 'desc' }, cb);
    });
});

export default { execute, name: 'logs' };
