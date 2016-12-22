import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { AppActions, TransactionActions, ProfileActions } from 'local-flux';

class ProfileUpdater extends Component {

    componentWillReceiveProps (nextProps) {
        this.launchActions(nextProps);
        this.listenForMinedTx(nextProps);
    }

    launchActions = (nextProps) => {
        const { pendingActions, appActions, profileActions } = nextProps;
        const actions = pendingActions.filter(action =>
            action.get('status') === 'readyToPublish' && action.get('type') === 'updateProfile');
        if (actions.size > 0) {
            actions.forEach((action) => {
                appActions.updatePendingAction(action.merge({
                    status: 'publishing'
                }));
                profileActions.updateProfileData(
                    action.getIn(['payload', 'profileData']), action.get('gas')
                );
            });
        }
    };

    listenForMinedTx = (nextProps) => {
        const { minedTx, pendingTx, fetchingMined, fetchingPending, deletingPendingTx, appActions,
            profileActions, transactionActions, loggedProfile, pendingActions } = nextProps;
        const isNotFetching = !fetchingMined && !fetchingPending;
        const pendingTxs = isNotFetching ?
            pendingTx.toJS().filter(tx =>
                tx.profile === loggedProfile &&
                tx.type === 'updateProfile' &&
                !!minedTx.find(mined => mined.tx === tx.tx) &&
                !deletingPendingTx.find(deleting => deleting.tx === tx.tx && deleting.value)
            ) :
            [];

        pendingTxs.forEach((tx) => {
            const correspondingAction = pendingActions.find(action =>
                action.get('type') === tx.type && action.get('status') === 'publishing');
            transactionActions.listenForMinedTx({ watch: false });
            transactionActions.deletePendingTx(tx.tx);
            profileActions.updateProfileDataSuccess();
            profileActions.getProfileData([{ profile: loggedProfile }], true);
            if (correspondingAction) {
                appActions.deletePendingAction(correspondingAction.get('id'));
            }
        });
    };

    render () {
        return null;
    }
}

ProfileUpdater.propTypes = {
    appActions: PropTypes.shape(),
    profileActions: PropTypes.shape(),
    transactionActions: PropTypes.shape(),
    pendingActions: PropTypes.shape(),
    fetchingMined: PropTypes.bool,
    fetchingPending: PropTypes.bool,
    deletingPendingTx: PropTypes.shape(),
    minedTx: PropTypes.shape(),
    pendingTx: PropTypes.shape(),
    loggedProfile: PropTypes.string
};

function mapStateToProps (state, ownProps) {
    return {
        fetchingMined: state.transactionState.get('fetchingMined'),
        fetchingPending: state.transactionState.get('fetchingPending'),
        updatingProfile: state.profileState.getIn(['flags', 'updatingProfile']),
        deletingPendingTx: state.transactionState.getIn(['flags', 'deletingPendingTx']),
        minedTx: state.transactionState.get('mined'),
        pendingTx: state.transactionState.get('pending'),
        pendingActions: state.appState.get('pendingActions'),
        loggedProfile: state.profileState.getIn(['loggedProfile', 'profile'])
    };
}

function mapDispatchToProps (dispatch) {
    return {
        appActions: new AppActions(dispatch),
        profileActions: new ProfileActions(dispatch),
        transactionActions: new TransactionActions(dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileUpdater);
