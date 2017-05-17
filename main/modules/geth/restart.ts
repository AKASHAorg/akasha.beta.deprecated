import * as Promise from 'bluebird';
import { GethConnector } from '@akashaproject/geth-connector';

const execute = Promise.coroutine(function*(data: GethRestartRequest) {
    return  GethConnector.getInstance().restart(data.timer);
});

export default { execute, name: 'restartService' };