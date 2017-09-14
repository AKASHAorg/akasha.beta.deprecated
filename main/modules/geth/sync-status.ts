import * as Promise from 'bluebird';
import { gethHelper } from '@akashaproject/geth-connector';

const execute = Promise.coroutine(function* () {
    const state = yield gethHelper.inSync();
    if (!state.length) {
        return { synced: true };
    }
    if (state.length === 2) {
        return Object.assign({ synced: false, peerCount: state[0] }, state[1]);
    }
    return { synced: false, peerCount: state[0] };
});

export default { execute, name: 'syncStatus' };
