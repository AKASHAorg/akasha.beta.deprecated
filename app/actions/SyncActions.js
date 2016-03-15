import * as types from '../constants/SyncConstants';
const remote       = require('electron').remote;
const gethInstance = remote.getGlobal('gethInstance');

export function isSyncing (message) {
  return { type: types.SYNC_ACTIVE, message };
}

export function getSyncStatus () {
  return (dispatch, getState) => {
    gethInstance.web3.eth.getSyncingAsync().then((data) => {
      dispatch(isSyncing(data));
      console.log(data);
    }).catch((err) => console.log(err));
  };
}

export function stopSyncing (message) {
  return { type: types.SYNC_STOPPED, message };
}

export function finishSync (mesage) {
  return { type: types.SYNC_FINISHED, message };
}
