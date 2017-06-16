import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { showAuthDialog, showPublishConfirmDialog, showTransferConfirmDialog,
    showWeightConfirmDialog, updateAction } from '../../local-flux/actions/app-actions';

const CONFIRMATION_ENTITIES = ['tempProfile'];

class CommonRunner extends Component {
    componentWillUpdate (nextProps) {
        const { pendingActions, loggedProfile } = nextProps;
        pendingActions.forEach((action) => {
            const { currentAction, actionType, confirmed, entityType, entityId } = action;
            const needsConfirmation = !confirmed && CONFIRMATION_ENTITIES.includes(entityType);
            const isLoggedIn = Date.parse(loggedProfile.get('expiration')) - 3000 > Date.now();
            if (needsConfirmation) {
                return this.props.showPublishConfirmDialog(entityId);
            }
            if (isLoggedIn) {
                console.log('for actiontype:', actionType, 'run action:', currentAction);
                return '';
            }
            return this.props.showAuthDialog(action.get('entityId'));
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
    //             this.props.showAuthDialog(confirmedActions.first().get('id'));
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
    showAuthDialog: PropTypes.func.isRequired,
    showPublishConfirmDialog: PropTypes.func.isRequired
};

function mapStateToProps (state) {
    return {
        loggedProfile: state.profileState.get('loggedProfile'),
        pendingActions: state.appState.get('pendingActions'),
        publishConfirmDialog: state.appState.get('publishConfirmDialog'),
        authDialog: state.appState.get('showAuthDialog')
    };
}

export default connect(
    mapStateToProps,
    {
        showAuthDialog,
        showPublishConfirmDialog,
        showTransferConfirmDialog,
        showWeightConfirmDialog,
        updateAction
    }
)(CommonRunner);
