import * as Promise from 'bluebird';
import { GethConnector } from '@akashaproject/geth-connector';

const execute = Promise.coroutine(function*() {
    return GethConnector.getInstance().stop().then(() => {});
});

export default { execute, name: 'stopService' };