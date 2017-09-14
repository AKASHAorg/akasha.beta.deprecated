import * as Promise from 'bluebird';
import { GethConnector } from '@akashaproject/geth-connector';

const execute = Promise.coroutine(function* (data: GethStartRequest) {
    if (GethConnector.getInstance().serviceStatus.process) {
        throw new Error('Geth is already running');
    }
    GethConnector.getInstance().setOptions(data);
    GethConnector.getInstance().enableDownloadEvents();
    // start daemon
    yield GethConnector.getInstance().start();
    return {};
});

export default { execute, name: 'startService' };
