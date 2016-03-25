import * as types from '../constants/SyncConstants';
const remote       = require('electron').remote;
const gethRemote = remote.getGlobal('gethInstance');

export function isSyncing (status) {
  return { type: types.SYNC_ACTIVE, status };
}

export function stopSyncing () {
  return { type: types.SYNC_STOPPED };
}

export function finishSync () {
  return { type: types.SYNC_FINISHED };
}

export function getSyncStatus () {
  return (dispatch, getState) => {
    gethRemote.inSync().then((data) => {
      if (!data) {
        return dispatch(finishSync('Synced'));
      }

      return dispatch(isSyncing(data));
    });
  };
}
