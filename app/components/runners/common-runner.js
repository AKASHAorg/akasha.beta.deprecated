import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import actionStatus from '../../constants/action-status';
import { showAuthDialog, showPublishConfirmDialog, showTransferConfirmDialog,
    showWeightConfirmDialog, pendingActionUpdate } from '../../local-flux/actions/app-actions';

class CommonRunner extends Component {

    componentWillReceiveProps (nextProps) {
        const { pendingActions, publishConfirmDialog, authDialog, loggedProfile } = nextProps;
        const unconfirmedTransferActions = pendingActions.filter(action =>
            action.get('status') === actionStatus.needTransferConfirmation);
        const unconfirmedWeightActions = pendingActions.filter(action =>
            action.get('status') === actionStatus.needWeightConfirmation);
        const unconfirmedActions = pendingActions.filter(action =>
            action.get('status') === actionStatus.needConfirmation);
        const confirmedActions = pendingActions.filter(action =>
            action.get('status') === actionStatus.checkAuth);
        if (!!publishConfirmDialog || !!authDialog) {
            return;
        }
        if (unconfirmedTransferActions.size > 0) {
            this.props.showTransferConfirmDialog(unconfirmedTransferActions.first().get('id'));
        } else if (unconfirmedWeightActions.size > 0) {
            this.props.showWeightConfirmDialog(unconfirmedWeightActions.first().get('id'));
        } else if (unconfirmedActions.size > 0) {
            this.props.showPublishConfirmDialog(unconfirmedActions.first().get('id'));
        } else if (confirmedActions.size > 0) {
            const isLoggedIn = Date.parse(loggedProfile.get('expiration')) - 3000 > Date.now();
            if (isLoggedIn) {
                confirmedActions.forEach(action =>
                    this.props.pendingActionUpdate(action.get('id'), {
                        status: actionStatus.readyToPublish
                    }));
            } else {
                this.props.showAuthDialog(confirmedActions.first().get('id'));
            }
        }
    }

    render () {
        return null;
    }
}

CommonRunner.propTypes = {
    authDialog: PropTypes.number,
    loggedProfile: PropTypes.shape(),
    pendingActions: PropTypes.shape(),
    publishConfirmDialog: PropTypes.shape(),
    showAuthDialog: PropTypes.func.isRequired,
    showPublishConfirmDialog: PropTypes.func.isRequired,
    showTransferConfirmDialog: PropTypes.func.isRequired,
    showWeightConfirmDialog: PropTypes.func.isRequired,
    pendingActionUpdate: PropTypes.func.isRequired
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
        pendingActionUpdate
    }
)(CommonRunner);
