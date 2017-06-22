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
    state = {}
    componentWillUpdate (nextProps) {
        const { pendingActions, loggedProfile } = nextProps;

        pendingActions.forEach((action) => {
            const { currentAction, actionType, confirmed, entityType, entityId } = action;

            const needsGasConfirmation = !confirmed &&
                GAS_CONFIRMATION_ENTITIES.includes(entityType);
            const needsWeightConfirmation = !confirmed &&
                WEIGHT_CONFIRMATION_ENTITIES.includes(entityType);
            const needsTransferConfirmation = !confirmed &&
                TRANSFER_CONFIRMATION_ENTITIES.includes(entityType);

            const isLoggedIn = Date.parse(loggedProfile.get('expiration')) - 3000 > Date.now();
            console.log(isLoggedIn, 'isLoggedIn');
            if (needsGasConfirmation) {
                return this.props.publishConfirmDialogToggle(entityId);
            }

            if (needsWeightConfirmation) {
                return this.props.weightConfirmDialogToggle(entityId);
            }

            if (needsTransferConfirmation) {
                return this.props.transferConfirmDialogToggle(entityId);
            }

            if (!isLoggedIn && confirmed) {
                return this.props.authDialogToggle(action.get('entityId'));
            }

            // TODO: save pending action to db;


            console.log('for actiontype:', actionType, 'run action:', currentAction);
            return '';
        });
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
    authDialogToggle: PropTypes.func.isRequired,
    publishConfirmDialogToggle: PropTypes.func.isRequired,
    transferConfirmDialogToggle: PropTypes.func.isRequired,
    weightConfirmDialogToggle: PropTypes.func.isRequired,
    pendingActionSave: PropTypes.func.isRequired,
};

function mapStateToProps (state) {
    return {
        loggedProfile: state.profileState.get('loggedProfile'),
        pendingActions: state.appState.get('pendingActions'),
        publishConfirmDialog: state.appState.get('publishConfirmDialog'),
        authDialog: state.appState.get('showAuthDialog'),
    };
}

export default connect(
    mapStateToProps,
    {
        authDialogToggle,
        pendingActionSave,
        publishConfirmDialogToggle,
        transferConfirmDialogToggle,
        weightConfirmDialogToggle,
        updateAction
    }
)(CommonRunner);
