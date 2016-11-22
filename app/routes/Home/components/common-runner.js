import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { AppActions } from 'local-flux';

class CommonRunner extends Component {

    componentWillReceiveProps (nextProps) {
        const { pendingActions, publishConfirmDialog, showAuthDialog, appActions,
            loggedProfile } = nextProps;
        const unconfirmedActions = pendingActions.filter(action =>
            action.get('status') === 'needConfirmation');
        const confirmedActions = pendingActions.filter(action =>
            action.get('status') === 'checkAuth');
        if (!!publishConfirmDialog || !!showAuthDialog) {
            return;
        }
        if (unconfirmedActions.size > 0) {
            appActions.showPublishConfirmDialog(unconfirmedActions.first());
        } else if (confirmedActions.size > 0) {
            const isLoggedIn = Date.parse(loggedProfile.get('expiration')) > Date.now();
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
