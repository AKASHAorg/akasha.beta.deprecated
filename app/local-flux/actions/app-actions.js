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

    hideEntryModal = () =>
        Promise.resolve(this.dispatch(appActionCreators.hideEntryModal()));

    setTimestamp = timestamp =>
        this.dispatch(appActionCreators.setTimestamp(timestamp));

    showNotification = notification =>
        this.dispatch(appActionCreators.showNotification(notification));

    hideNotification = notification =>
        this.dispatch(appActionCreators.hideNotification(notification));

    cleanStore = () => this.dispatch(appActionCreators.cleanStore());
}

export const appReady = () => action(types.APP_READY);

export const authDialogToggle = actionId => action(types.AUTH_DIALOG_TOGGLE, { actionId });

export const bootstrapHome = () => action(types.BOOTSTRAP_HOME);

export const bootstrapHomeSuccess = () => action(types.BOOTSTRAP_HOME_SUCCESS);

export const deletePendingAction = actionId => action(types.DELETE_PENDING_ACTION, { actionId });

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
export const pendingActionDelete = actionId => action(types.PENDING_ACTION_DELETE, { actionId });
export const pendingActionUpdate = data => action(types.PENDING_ACTION_UPDATE, { data });
export const pendingActionSave = data => action(types.PENDING_ACTION_SAVE, { data });

// this should be removed once profile logout is implemented
export const resetHomeReady = () => action(types.RESET_HOME_READY);

export const showLoginDialog = akashaId =>
    action(types.SHOW_LOGIN_DIALOG, { akashaId });

export const showNotification = notification =>
    action(types.SHOW_NOTIFICATION, { notification });

export const showReportModal = data => action(types.SHOW_REPORT_MODAL, { data });

export const showTerms = () => action(types.SHOW_TERMS);

export const toggleGethDetailsModal = () => action(types.TOGGLE_GETH_DETAILS_MODAL);

export const toggleIpfsDetailsModal = () => action(types.TOGGLE_IPFS_DETAILS_MODAL);

export const publishConfirmDialogToggle = actionId =>
    action(types.PUBLISH_CONFIRM_DIALOG_TOGGLE, { actionId });

export const transferConfirmDialogToggle = actionId =>
    action(types.TRANSFER_CONFIRM_DIALOG_TOGGLE, { actionId });

export const weightConfirmDialogToggle = actionId =>
    action(types.WEIGHT_CONFIRM_DIALOG_TOGGLE, { actionId });

export { AppActions };
