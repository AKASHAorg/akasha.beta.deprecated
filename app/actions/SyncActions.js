import * as types from '../constants/SyncConstants';
import { startGethService, stopGethService } from '../services/setup-service';

/**
 * Dispatcher for starting sync
 * @returns {function()}
 */
export function startSync () {
    startGethService().then((data) => {
        if (!data.success) {
            console.log(data);
            return { type: types.SYNC_ACTIVE_ERROR };
        }
        return { type: types.SYNC_ACTIVE };
    });
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
    return dispatch => {
        stopGethService().then(data => {
            // if (!data.success) {
            //     return dispatch({ type: types.SYNC_STOP_ERROR });
            // }
            return dispatch({ type: types.SYNC_STOPPED });
        });
    };
}
