import * as types from '../constants/SyncConstants';
import { SetupService } from '../services';
import { SettingsActions } from './';

class SyncActions {
    constructor (dispatch) {
        this.dispatch = dispatch;
        this.settingsActions = new SettingsActions(dispatch);
        this.setupService = new SetupService;
    }
    
    /**
     * Dispatcher for starting sync
     * @returns {function()}
     */
    startSync = () => this.dispatch({ type: types.SYNC_ACTIVE })
    /**
     * Dispatcher for resuming sync
     * @returns {function()}
     */
    resumeSync = () => this.dispatch({ type: types.SYNC_RESUME });
    pauseSync = () => {
        this.stopUpdateSync(() => {
            this.dispatch({ type: types.SYNC_PAUSE });
        });
    }
    /**
     * Action for stopping sync
     * @returns {{type}}
     */
    stopSync = () => {
        this.stopUpdateSync(() => {
            this.dispatch({ type: types.SYNC_STOPPED });
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
