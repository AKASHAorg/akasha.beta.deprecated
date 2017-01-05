import { appActionCreators } from './action-creators';
import { AppService } from '../services';

let appActions = null;

class AppActions {
    constructor (dispatch) { // eslint-disable-line consistent-return
        if (appActions) {
            return appActions;
        }
        this.dispatch = dispatch;
        this.appService = new AppService();
        this.pendingActionId = 1;
        appActions = this;
    }
    checkForUpdates = () =>
        this.appService.checkForUpdates().then(hasUpdates =>
            this.dispatch(appActionCreators.checkForUpdates(hasUpdates))
        );

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
    changePanel = panel => this.showPanel(panel);
    showPanel = panel => this.dispatch(appActionCreators.showPanel(panel));
    hidePanel = panel => this.dispatch(appActionCreators.hidePanel(panel));
    showAuthDialog = actionId => this.dispatch(appActionCreators.showAuthDialog(actionId));
    hideAuthDialog = () => this.dispatch(appActionCreators.hideAuthDialog());
    /**
     * Show a confirmation dialog for every resource he wants to publish
     * Request gas amount
     */
    showPublishConfirmDialog = resource =>
        this.dispatch(appActionCreators.showPublishConfirmDialog(resource));
    hidePublishConfirmDialog = () =>
        this.dispatch(appActionCreators.hidePublishConfirmDialog());
    showEntryModal = (entryData, options = {}) =>
        Promise.resolve(this.dispatch(appActionCreators.showEntryModal(entryData, options)));
    hideEntryModal = () =>
        Promise.resolve(this.dispatch(appActionCreators.hideEntryModal()));
    showWeightConfirmDialog = resource =>
        this.dispatch(appActionCreators.showWeightConfirmDialog(resource));
    hideWeightConfirmDialog = () => {
        this.dispatch(appActionCreators.hideWeightConfirmDialog());
    };
    setTimestamp = timestamp =>
        this.dispatch(appActionCreators.setTimestamp(timestamp));

    addPendingAction = (data) => {
        data.id = this.pendingActionId;
        this.pendingActionId += 1;
        this.dispatch(appActionCreators.addPendingAction(data));
    };

    updatePendingAction = data =>
        this.dispatch(appActionCreators.updatePendingAction(data));

    deletePendingAction = actionId =>
        this.dispatch(appActionCreators.deletePendingAction(actionId));

    showNotification = notification =>
        this.dispatch(appActionCreators.showNotification(notification));

    hideNotification = notification =>
        this.dispatch(appActionCreators.hideNotification(notification));

    showTerms = () => this.dispatch(appActionCreators.showTerms());

    hideTerms = () => this.dispatch(appActionCreators.hideTerms());

    cleanStore = () => this.dispatch(appActionCreators.cleanStore());
}

export { AppActions };
