import { appActionCreators } from './action-creators';
import * as types from '../constants/AppConstants';

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

export function appReady () {
    return {
        type: types.APP_READY
    };
}

export function setTimestamp (timestamp) {
    return {
        type: types.SET_TIMESTAMP,
        timestamp
    };
}

export function toggleGethDetailsModal () {
    return {
        type: types.TOGGLE_GETH_DETAILS_MODAL
    };
}

export function toggleIpfsDetailsModal () {
    return {
        type: types.TOGGLE_IPFS_DETAILS_MODAL
    };
}

export function showNotification (notification) {
    return {
        type: types.SHOW_NOTIFICATION,
        notification
    };
}

export function hideNotification (notification) {
    return {
        type: types.HIDE_NOTIFICATION,
        notification
    };
}

export function hideTerms () {
    return {
        type: types.HIDE_TERMS
    };
}

export { AppActions };
