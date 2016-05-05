import * as types from '../constants/SyncConstants';
import { hashHistory } from 'react-router';

let syncInterval = false;

/**
 * Action for sync progress providing data
 * @param status
 * @returns {{type, status: {object}}}
 */
function isSyncing (status) {
  return { type: types.SYNC_ACTIVE, status };
}

/**
 * Action handler for sync completion
 * @returns {{type}}
 */
export function finishSync () {
  hashHistory.push('/authenticate');
  return { type: types.SYNC_FINISHED };
}

/**
 * Dispatcher for sync progress
 * @returns {function()}
 */
export function getSyncStatus () {
  return (dispatch, getState) => {
    window.gethInstance.inSync().then((data) => {
      if (!data) {
        clearInterval(syncInterval);
        return dispatch(finishSync('Synced'));
      }
      return dispatch(isSyncing(data));
    });
  };
}

/**
 * Dispatcher for starting sync
 * @returns {function()}
 */
export function startSync () {
  return (dispatch, getState) => {
    if (syncInterval) {
      clearInterval(syncInterval);
    }
    syncInterval = setInterval(() => dispatch(getSyncStatus()), 500);
  };
}

/**
 * Dispatcher for resuming sync
 * @returns {function()}
 */
export function resumeSync () {
  return (dispatch, getState) => {
    window.gethInstance.start().then(() => {
      setTimeout(() => dispatch(startSync()), 4000);
    });
    dispatch({ type: types.SYNC_RESUME });
  };
}

/**
 * Action for stopping sync
 * @returns {{type}}
 */
export function stopSync () {
  window.gethInstance.stop();
  clearInterval(syncInterval);
  return { type: types.SYNC_STOPPED };
}
