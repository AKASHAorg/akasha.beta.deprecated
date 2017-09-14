import * as Promise from 'bluebird';
import { GethConnector } from '@akashaproject/geth-connector';

const execute = Promise.coroutine(function* () {
    yield GethConnector.getInstance().stop();
    return {};
});

export default { execute, name: 'stopService' };
