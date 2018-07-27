import * as Promise from 'bluebird';
import { CORE_MODULE, GETH_MODULE } from '@akashaproject/common/constants';

export default function init(sp, getService) {
  const execute = Promise.coroutine(function* () {
    const state = yield getService(CORE_MODULE.WEB3_HELPER).inSync();
    if (!state.length) {
      if (!getService(CORE_MODULE.CONTRACTS).instance) {
        yield getService(CORE_MODULE.CONTRACTS)
          .init().then(() => console.log('contracts init'));
      }
      return { synced: true };
    }
    if (state.length === 2) {
      return Object.assign({ synced: false, peerCount: state[0] }, state[1]);
    }
    return { synced: false, peerCount: state[0] };
  });

  const syncStatus = { execute, name: 'syncStatus' };
  const service = function () {
    return syncStatus;
  };
  sp().service(GETH_MODULE.syncStatus, service);
  return syncStatus;
}
