import * as types from '../constants/SyncConstants';
import { SetupService } from '../services';
import { SettingsActions, EProcActions } from './';

class SyncActions {
    constructor (dispatch) {
        this.dispatch = dispatch;
        this.settingsActions = new SettingsActions(dispatch);
        this.setupService = new SetupService;
        this.eProcActions = new EProcActions(dispatch);
    }

    /**
     * Dispatcher for starting sync
     * @returns {function()}
     */
    startSync = () =>
        this.dispatch(() =>
            this.eProcActions.startGeth()
        ).then(() =>
            this.dispatch({ type: types.SYNC_ACTIVE })
        );
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
    requestCancel = () =>
        this.dispatch(() =>
            this.settingsActions.saveSettings('flags', { requestStartupChange: true })
        ).then(() => {
            this.stopUpdateSync();
        });
    /**
     * Action for stopping sync
     * @returns {{type}}
     */
    stopSync = () =>
        this.dispatch(() => this.stopUpdateSync());

    startUpdateSync = (cb) => {
        this.setupService.startUpdateSync(cb);
    }
    stopUpdateSync = () =>
        this.setupService.stopUpdateSync().then(() =>
            this.dispatch({ type: types.SYNC_STOPPED })
        );
}

export { SyncActions };
