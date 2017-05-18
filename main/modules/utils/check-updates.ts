import { constructed } from '../../contracts/index';
import { GethConnector } from '@akashaproject/geth-connector';
import updater from '../../check-version';
import * as Promise from 'bluebird';

const execute = Promise.coroutine(function*() {
    return constructed
        .instance
        .feed
        .contract
        .getAppState((err, state) => {
            const version = GethConnector.getInstance().web3.toUtf8(state[0]);
            return updater.checkVersion(version, state[1], state[2]);
        });
});

export default { execute, name: 'checkUpdate' };