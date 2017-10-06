import * as Promise from 'bluebird';
import { gethHelper } from '@akashaproject/geth-connector';
import contracts from '../../contracts';

const execute = Promise.coroutine(function* () {
    const state = yield gethHelper.inSync();
    if (!state.length) {
        if (!contracts.instance) {
            yield contracts.init().then(() => console.log('contracts inited'));
        }
        return { synced: true };
    }
    if (state.length === 2) {
        return Object.assign({ synced: false, peerCount: state[0] }, state[1]);
    }
    return { synced: false, peerCount: state[0] };
});

export default { execute, name: 'syncStatus' };
