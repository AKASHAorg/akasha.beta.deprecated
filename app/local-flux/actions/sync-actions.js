import { syncActionCreators } from './action-creators';
import { SetupService } from '../services';
import { SettingsActions, EProcActions } from './';
let syncActions = null;

class SyncActions {
    constructor (dispatch) {
        if (!syncActions) {
            syncActions = this;
        }
        this.dispatch = dispatch;
        this.settingsActions = new SettingsActions(dispatch);
        this.setupService = new SetupService;
        this.eProcActions = new EProcActions(dispatch);
        return syncActions;
    }

    /**
     * Dispatcher for starting sync
     * @returns {function()}
     */
    startSync = () =>
        this.dispatch(() =>
            this.eProcActions.startGeth()
        ).then(() =>
            this.dispatch(syncActionCreators.startSync())
        );
    /**
     * Dispatcher for resuming sync
     * @returns {function()}
     */
    resumeSync = () => this.dispatch(syncActionCreators.resumeSync());
    pauseSync = () => {
        this.stopUpdateSync(() => {
            this.dispatch(syncActionCreators.pauseSync());
            this.eProcActions.stopGeth();
        });
    };

    requestCancel = () =>
        this.dispatch(() =>
            this.settingsActions.saveSettings('flags', { requestStartupChange: true })
        ).then(() => {
            this.eProcActions.stopGeth()
            this.stopUpdateSync();
        });
    /**
     * Action for stopping sync
     * @returns {{type}}
     */
    stopSync = () =>
        this.dispatch(() => this.stopUpdateSync().then(() => syncActionCreators.stopSync()));

    startUpdateSync = (cb) => {
        this.setupService.startUpdateSync(cb);
    };
    stopUpdateSync = () =>
        this.setupService.stopUpdateSync();
}
export { SyncActions };
