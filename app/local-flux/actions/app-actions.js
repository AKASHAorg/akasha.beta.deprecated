import { appActionCreators } from './action-creators';
import { AppService } from '../services';

let appActions = null;

class AppActions {
    constructor (dispatch) {
        if (!appActions) {
            appActions = this;
        }
        this.dispatch = dispatch;
        this.appService = new AppService();
        return appActions;
    }
    checkForUpdates = () => {
        this.appService.checkForUpdates().then(updates => {
            this.dispatch(appActionCreators.checkForUpdates(updates));
        });
    };
    updateApp = () => {};
    showError = (error) => {
        this.dispatch(appActionCreators.showError(error));
    };

    clearErrors = () => {
        this.dispatch(appActionCreators.clearError());
    };
    /**
     * Changes currently visible panel
     * @param {Object} panel
     * @param {String} panel.name
     * @param {Boolean} panel.overlay Shows clickable overlay below panel. Useful to close the panel
     */
    changePanel = (panel) => this.showPanel(panel);
    showPanel = (panel) => this.dispatch(appActionCreators.showPanel(panel));
    hidePanel = (panel) => this.dispatch(appActionCreators.hidePanel(panel));
    showAuthDialog = () => this.dispatch(appActionCreators.showAuthDialog());
    hideAuthDialog = () => this.dispatch(appActionCreators.hideAuthDialog());
    resumeEntryPublishing = () => {
        // console.log(payload);
    };
    showEntryModal = (entryData) =>
        Promise.resolve(this.dispatch(appActionCreators.showEntryModal(entryData)));
    hideEntryModal = () =>
        Promise.resolve(this.dispatch(appActionCreators.hideEntryModal()));
}

export { AppActions };
