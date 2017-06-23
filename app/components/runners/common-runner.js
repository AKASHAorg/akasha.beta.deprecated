import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import {
    authDialogToggle,
    pendingActionSave,
    publishConfirmDialogToggle,
    transferConfirmDialogToggle,
    weightConfirmDialogToggle,
    updateAction } from '../../local-flux/actions/app-actions';

const GAS_CONFIRMATION_ENTITIES = ['tempProfile'];
const WEIGHT_CONFIRMATION_ENTITIES = ['upvote', 'downvote'];
const TRANSFER_CONFIRMATION_ENTITIES = ['tip'];

class CommonRunner extends Component {
    shouldComponentUpdate (nextProps) {
        return !nextProps.loggedProfile.equals(this.props.loggedProfile) ||
            !nextProps.pendingActions.equals(this.props.pendingActions);
    }
    componentWillUpdate (nextProps) {
        const { pendingActions, loggedProfile, state } = nextProps;
        const { dispatch } = this.props;
        pendingActions.forEach((action) => {
            const { currentAction, confirmed, entityType, entityId,
                publishTx } = action;

            const needsGasConfirmation = !confirmed &&
                GAS_CONFIRMATION_ENTITIES.includes(entityType);
            const needsWeightConfirmation = !confirmed &&
                WEIGHT_CONFIRMATION_ENTITIES.includes(entityType);
            const needsTransferConfirmation = !confirmed &&
                TRANSFER_CONFIRMATION_ENTITIES.includes(entityType);

            const isLoggedIn = Date.parse(loggedProfile.get('expiration')) - 3000 > Date.now();

            if (needsGasConfirmation) {
                return dispatch(publishConfirmDialogToggle(entityId));
            }

            if (needsWeightConfirmation) {
                return dispatch(weightConfirmDialogToggle(entityId));
            }

            if (needsTransferConfirmation) {
                return dispatch(transferConfirmDialogToggle(entityId));
            }

            if (!isLoggedIn && confirmed && !publishTx) {
                return dispatch(authDialogToggle(action.get('entityId')));
            }

            const actionPayload = this._getActionPayload(action, state);
            this._savePendingAction(action, actionPayload);

            return dispatch({ type: currentAction, data: actionPayload });
        });
    }
    _getActionPayload = (action, state) => {
        const { entityType } = action;
        let entityPayload;
        switch (entityType) {
            case 'tempProfile':
                entityPayload = state.tempProfileState.get('tempProfile');
                break;
            default:
                entityPayload = null;
        }
        return entityPayload;
    }
    _savePendingAction = (action, entityPayload) => {
        const { dispatch } = this.props;
        dispatch(pendingActionSave(action, entityPayload));
    }
    _publishPendingAction = (action) => {

    }
    // componentWillReceiveProps (nextProps) {
    //     const { pendingActions, publishConfirmDialog, authDialog, loggedProfile } = nextProps;
    //     const unconfirmedTransferActions = pendingActions.filter(action =>
    //         action.get('status') === actionStatus.needTransferConfirmation);
    //     const unconfirmedWeightActions = pendingActions.filter(action =>
    //         action.get('status') === actionStatus.needWeightConfirmation);
    //     const unconfirmedActions = pendingActions.filter(action =>
    //         action.get('status') === actionStatus.needConfirmation);
    //     const confirmedActions = pendingActions.filter(action =>
    //         action.get('status') === actionStatus.checkAuth);
    //     if (!!publishConfirmDialog || !!authDialog) {
    //         return;
    //     }
    //     if (unconfirmedTransferActions.size > 0) {
    //         this.props.showTransferConfirmDialog(unconfirmedTransferActions.first().get('id'));
    //     } else if (unconfirmedWeightActions.size > 0) {
    //         this.props.showWeightConfirmDialog(unconfirmedWeightActions.first().get('id'));
    //     } else if (unconfirmedActions.size > 0) {
    //         this.props.showPublishConfirmDialog(unconfirmedActions.first().get('id'));
    //     } else if (confirmedActions.size > 0) {
    //         const isLoggedIn = Date.parse(loggedProfile.get('expiration')) - 3000 > Date.now();
    //         if (isLoggedIn) {
    //             confirmedActions.forEach(action =>
    //                 this.props.updateAction(action.get('id'), {
    //                     status: actionStatus.readyToPublish
    //                 }));
    //         } else {
    //             this.props.authDialogToggle(confirmedActions.first().get('id'));
    //         }
    //     }
    // }

    render () {
        return null;
    }
}

CommonRunner.propTypes = {
    loggedProfile: PropTypes.shape(),
    pendingActions: PropTypes.shape(),
    publishConfirmDialog: PropTypes.string,
    authDialog: PropTypes.string,
    dispatch: PropTypes.func.isRequired
};

export default connect(
    state => ({
        loggedProfile: state.profileState.get('loggedProfile'),
        pendingActions: state.appState.get('pendingActions'),
        publishConfirmDialog: state.appState.get('publishConfirmDialog'),
        authDialog: state.appState.get('showAuthDialog'),
        state
    })
)(CommonRunner);
