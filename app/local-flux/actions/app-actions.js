import { appActionCreators } from './action-creators';
import * as types from '../constants';
import { action } from './helpers';

let appActions = null;

class AppActions {
    constructor (dispatch) { // eslint-disable-line consistent-return
        if (appActions) {
            return appActions;
        }
        this.dispatch = dispatch;
        this.pendingActionId = 1;
        appActions = this;
    }

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
    hideEntryModal = () =>
        Promise.resolve(this.dispatch(appActionCreators.hideEntryModal()));
    showWeightConfirmDialog = resource =>
        this.dispatch(appActionCreators.showWeightConfirmDialog(resource));
    hideWeightConfirmDialog = () => {
        this.dispatch(appActionCreators.hideWeightConfirmDialog());
    };
    showTransferConfirmDialog = resource =>
        this.dispatch(appActionCreators.showTransferConfirmDialog(resource));
    hideTransferConfirmDialog = () => {
        this.dispatch(appActionCreators.hideTransferConfirmDialog());
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

export const appReady = () => action(types.APP_READY);
export const bootstrapHome = () => action(types.BOOTSTRAP_HOME);
export const bootstrapHomeSuccess = () => action(types.BOOTSTRAP_HOME_SUCCESS);
export const deletePendingAction = actionId => action(types.DELETE_PENDING_ACTION, { actionId });
export const hideAuthDialog = () => action(types.HIDE_AUTH_DIALOG);
export const hideLoginDialog = () => action(types.HIDE_LOGIN_DIALOG);
export const hideNotification = notification =>
    action(types.HIDE_NOTIFICATION, { notification });
export const hideReportModal = () => action(types.HIDE_REPORT_MODAL);
export const hideTerms = () => action(types.HIDE_TERMS);
export const hideTransferConfirmDialog = () => action(types.HIDE_TRANSFER_CONFIRM_DIALOG);
export const hideWeightConfirmDialog = () => action(types.HIDE_WEIGHT_CONFIRM_DIALOG);
export const panelShow = panel => action(types.PANEL_SHOW, { panel });
export const panelHide = () => action(types.PANEL_HIDE);

// for publishing to blockchain
export const publishEntity = data => action(types.PUBLISH_ENTITY, { data });

// this should be removed once profile logout is implemented
export const resetHomeReady = () => action(types.RESET_HOME_READY);

export const showAuthDialog = actionId => action(types.SHOW_AUTH_DIALOG, { actionId });
export const showLoginDialog = akashaId =>
    action(types.SHOW_LOGIN_DIALOG, { akashaId });
export const showNotification = notification =>
    action(types.SHOW_NOTIFICATION, { notification });
export const showPublishConfirmDialog = actionId =>
    action(types.SHOW_PUBLISH_CONFIRM_DIALOG, { actionId });
export const showReportModal = data => action(types.SHOW_REPORT_MODAL, { data });
export const showTerms = () => action(types.SHOW_TERMS);
export const showTransferConfirmDialog = actionId =>
    action(types.SHOW_TRANSFER_CONFIRM_DIALOG, { actionId });
export const showWeightConfirmDialog = actionId =>
    action(types.SHOW_WEIGHT_CONFIRM_DIALOG, { actionId });
export const toggleGethDetailsModal = () => action(types.TOGGLE_GETH_DETAILS_MODAL);
export const toggleIpfsDetailsModal = () => action(types.TOGGLE_IPFS_DETAILS_MODAL);
export const updateAction = (actionId, updates) =>
    action(types.UPDATE_ACTION, { actionId, updates });
export { AppActions };
