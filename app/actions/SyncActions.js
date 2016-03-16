import * as types from '../constants/SyncConstants';
const remote       = require('electron').remote;
const gethInstance = remote.getGlobal('gethInstance');

export function isSyncing (message) {
  return { type: types.SYNC_ACTIVE, message };
}


export function stopSyncing (message) {
  return { type: types.SYNC_STOPPED, message };
}

export function finishSync (message) {
  return { type: types.SYNC_FINISHED, message };
}

export function getSyncStatus () {
  return (dispatch, getState) => {
    gethInstance.inSync().then((data) => {
      if (!data) {
        return dispatch(finishSync('Synced'));
      }

      return dispatch(isSyncing(data));
    });
  };
}
