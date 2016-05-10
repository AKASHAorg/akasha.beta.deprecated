import * as types from '../constants/SyncConstants';
import { hashHistory } from 'react-router';

/**
 * Action handler for sync completion
 * @returns {{type}}
 */
export function finishSync () {
  hashHistory.push('/authenticate');
  return { type: types.SYNC_FINISHED };
}

/**
 * Dispatcher for starting sync
 * @returns {function()}
 */
export function startSync () {
  return { type: types.SYNC_ACTIVE };
}

/**
 * Dispatcher for resuming sync
 * @returns {function()}
 */
export function resumeSync () {
  return { type: types.SYNC_RESUME };
}

/**
 * Action for stopping sync
 * @returns {{type}}
 */
export function stopSync () {
  return { type: types.SYNC_STOPPED };
}
