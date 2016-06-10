import * as types from '../constants/SyncConstants';
import { SetupService } from '../services';

class SyncActions {
    constructor (dispatch) {
        this.dispatch = dispatch;
        this.setupService = new SetupService;
    }
    /**
     * Dispatcher for starting sync
     * @returns {function()}
     */
    startSync = (options) => {
        this.setupService.startGeth(options).then(data => {
            if (!data.success) {
                console.log(data);
                return this.dispatch({ type: types.SYNC_ACTIVE_ERROR });
            }
            return this.dispatch({ type: types.SYNC_ACTIVE });
        });
    }
    /**
     * Dispatcher for resuming sync
     * @returns {function()}
     */
    resumeSync = () => this.dispatch({ type: types.SYNC_RESUME });
    pauseSync = () => this.dispatch({ type: types.SYNC_PAUSE });
    /**
     * Action for stopping sync
     * @returns {{type}}
     */
    stopSync = () => {
        this.setupService.stopGeth().then(data => {
            if (!data.success) {
                return this.dispatch({ type: types.SYNC_STOP_ERROR });
            }
            return this.dispatch({ type: types.SYNC_STOPPED, data });
        });
    }
    startUpdateSync = (cb) => {
        this.setupService.startUpdateSync(cb);
    }
    stopUpdateSync = (cb) => {
        this.setupService.stopUpdateSync(cb);
    }
}

export { SyncActions };
