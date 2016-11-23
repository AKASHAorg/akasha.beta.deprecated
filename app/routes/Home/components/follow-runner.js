import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { AppActions, TransactionActions, ProfileActions } from 'local-flux';

class FollowRunner extends Component {

    componentWillReceiveProps (nextProps) {
        this.launchActions(nextProps);
        this.listenForMinedTx(nextProps);
    }

    launchActions = (nextProps) => {
        const { pendingActions, appActions, profileActions } = nextProps;
        const actions = pendingActions.filter(action =>
            action.get('status') === 'readyToPublish');
        if (actions.size > 0) {
            actions.forEach((action) => {
                const actionType = action.get('type');
                switch (actionType) {
                    case 'followProfile':
                        appActions.updatePendingAction(action.merge({
                            status: 'publishing'
                        }));
                        profileActions.followProfile(
                            action.getIn(['payload', 'akashaId']), action.get('gas')
                        );
                        break;
                    case 'unfollowProfile':
                        appActions.updatePendingAction(action.merge({
                            status: 'publishing'
                        }));
                        profileActions.unfollowProfile(
                            action.getIn(['payload', 'akashaId']), action.get('gas')
                        );
                        break;
                    default:
                        break;
                }
            });
        }
    };

    listenForMinedTx = (nextProps) => {
        const { minedTx, pendingTx, fetchingMined, fetchingPending, deletingPendingTx, appActions,
            profileActions, transactionActions, loggedProfileData, pendingActions,
            profiles } = nextProps;
        const isNotFetching = !fetchingMined && !fetchingPending;
        const pendingFollowTxs = isNotFetching ?
            pendingTx.toJS().filter(tx =>
                tx.profile === loggedProfileData.get('profile') && (tx.type === 'followProfile' ||
                    tx.type === 'unfollowProfile')
            ) :
            [];

        pendingFollowTxs.forEach((tx) => {
            const isMined = minedTx.find(mined => mined.tx === tx.tx);
            if (isMined && !deletingPendingTx) {
                const loggedProfile = loggedProfileData.get('profile');
                const loggedAkashaId = loggedProfileData.get('akashaId');
                const profile = profiles.find(prf => prf.get('akashaId') === tx.akashaId);
                const profileAddress = profile ? profile.get('profile') : null;
                const correspondingAction = pendingActions.find(action =>
                    action.get('type') === tx.type && action.get('status') === 'publishing');
                transactionActions.listenForMinedTx({ watch: false });
                transactionActions.deletePendingTx(tx.tx);
                if (tx.type === 'followProfile') {
                    profileActions.followProfileSuccess(tx.akashaId);
                } else {
                    profileActions.unfollowProfileSuccess(tx.akashaId);
                }
                profileActions.getProfileData([{ profile: loggedProfile }], true);
                if (profileAddress) {
                    profileActions.getProfileData([{ profile: profileAddress }], true);
                }
                profileActions.isFollower(loggedAkashaId, tx.akashaId);
                appActions.deletePendingAction(correspondingAction.get('id'));
            }
        });
    };

    render () {
        return null;
    }
}

FollowRunner.propTypes = {
    appActions: PropTypes.shape(),
    profileActions: PropTypes.shape(),
    transactionActions: PropTypes.shape(),
    fetchingMined: PropTypes.bool,
    fetchingPending: PropTypes.bool,
    deletingPendingTx: PropTypes.bool,
    minedTx: PropTypes.shape(),
    pendingTx: PropTypes.shape(),
    pendingActions: PropTypes.shape(),
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
        loggedProfileData: state.profileState.get('profiles').find(profile =>
            profile.get('profile') === state.profileState.getIn(['loggedProfile', 'profile'])),
        pendingActions: state.appState.get('pendingActions'),
        profiles: state.profileState.get('profiles')
    };
}

function mapDispatchToProps (dispatch) {
    return {
        appActions: new AppActions(dispatch),
        profileActions: new ProfileActions(dispatch),
        transactionActions: new TransactionActions(dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FollowRunner);
