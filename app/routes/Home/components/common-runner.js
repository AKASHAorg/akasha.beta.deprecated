import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppActions } from 'local-flux';

class CommonRunner extends Component {

    componentWillReceiveProps (nextProps) {
        const { pendingActions, publishConfirmDialog, showAuthDialog, appActions,
            loggedProfile } = nextProps;
        const unconfirmedTransferActions = pendingActions.filter(action =>
            action.get('status') === 'needTransferConfirmation');
        const unconfirmedWeightActions = pendingActions.filter(action =>
            action.get('status') === 'needWeightConfirmation');
        const unconfirmedActions = pendingActions.filter(action =>
            action.get('status') === 'needConfirmation');
        const confirmedActions = pendingActions.filter(action =>
            action.get('status') === 'checkAuth');
        if (!!publishConfirmDialog || !!showAuthDialog) {
            return;
        }
        if (unconfirmedTransferActions.size > 0) {
            appActions.showTransferConfirmDialog(unconfirmedTransferActions.first());
        } else if (unconfirmedWeightActions.size > 0) {
            appActions.showWeightConfirmDialog(unconfirmedWeightActions.first());
        } else if (unconfirmedActions.size > 0) {
            appActions.showPublishConfirmDialog(unconfirmedActions.first());
        } else if (confirmedActions.size > 0) {
            const isLoggedIn = Date.parse(loggedProfile.get('expiration')) - 3000 > Date.now();
            if (isLoggedIn) {
                appActions.updatePendingAction(
                    confirmedActions.first().set('status', 'readyToPublish')
                );
            } else {
                appActions.showAuthDialog(confirmedActions.first().get('id'));
            }
        }
    }

    render () {
        return null;
    }
}

CommonRunner.propTypes = {
    pendingActions: PropTypes.shape(),
    publishConfirmDialog: PropTypes.shape(),
    showAuthDialog: PropTypes.number
};

function mapStateToProps (state) {
    return {
        loggedProfile: state.profileState.get('loggedProfile'),
        pendingActions: state.appState.get('pendingActions'),
        publishConfirmDialog: state.appState.get('publishConfirmDialog'),
        showAuthDialog: state.appState.get('showAuthDialog')
    };
}

function mapDispatchToProps (dispatch) {
    return {
        appActions: new AppActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CommonRunner);
