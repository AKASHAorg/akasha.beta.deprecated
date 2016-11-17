import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { AppActions, TransactionActions, ProfileActions } from 'local-flux';

class ProfileUpdater extends Component {
    constructor (props) {
        super(props);
        this.followRequestTimeout = null;
        this.unfollowRequestTimeout = null;
    }

    componentWillReceiveProps (nextProps) {
        const { fetchingMined, fetchingPending, minedTx, pendingTx, profileActions,
            transactionActions, loggedProfileData, deletingPendingTx, profiles } = nextProps;
        const isNotFetching = !fetchingMined && !fetchingPending;
        const loggedProfile = loggedProfileData.get('profile');
        const loggedAkashaId = loggedProfileData.get('akashaId');
        const pendingFollowTx = isNotFetching ?
            pendingTx.toJS().filter(tx =>
                tx.profile === loggedProfile && tx.type === 'followProfile'
            ) :
            [];
        const pendingUnfollowTx = isNotFetching ?
            pendingTx.toJS().filter(tx =>
                tx.profile === loggedProfile && tx.type === 'unfollowProfile'
            ) :
            [];
        if (pendingFollowTx.length) {
            const followTx = pendingFollowTx[0].tx;
            const isMined = minedTx.find(mined => mined.tx === followTx);
            const followPending = true;
            if (isMined && !deletingPendingTx) {
                const akashaId = pendingFollowTx[0].akashaId;
                const profile = profiles.find(prf => prf.get('akashaId') === akashaId);
                const profileAddress = profile ? profile.get('profile') : null;
                transactionActions.listenForMinedTx({ watch: false });
                transactionActions.deletePendingTx(followTx);
                profileActions.isFollower(loggedAkashaId, akashaId);
                profileActions.getProfileData([{ profile: loggedProfile }], true);
                if (profileAddress) {
                    profileActions.getProfileData([{ profile: profileAddress }], true);
                }
                profileActions.followProfileSuccess(pendingFollowTx[0].akashaId);
                if (this.followRequestTimeout) {
                    clearTimeout(this.followRequestTimeout);
                }
            } else if (!followPending) {
                // profileActions.updateProfile();
                // transactionActions.listenForMinedTx();
                // transactionActions.addToQueue([{ tx: followTx, type: 'updateProfile' }]);
                // this.followRequestTimeout = setTimeout(() => {
                //     const transactions = this.props.pendingTx.toJS().filter(tx =>
                //         tx.profile === loggedProfile && tx.type === 'updateProfile'
                //     );
                //     if (transactions.length > 0) {
                //         transactionActions.deletePendingTx(followTx);
                //         profileActions.deleteUpdateProfileTx(transactions[0].tx);
                //         transactionActions.listenForMinedTx({ watch: false });
                //         profileActions.updateProfileDataError({ message: 'transaction timeout' });
                //     }
                // }, 120000);
            }
        }

        if (pendingUnfollowTx.length) {
            const unfollowTx = pendingUnfollowTx[0].tx;
            const isMined = minedTx.find(mined => mined.tx === unfollowTx);
            const followPending = true;
            if (isMined && !deletingPendingTx) {
                const akashaId = pendingUnfollowTx[0].akashaId;
                const profile = profiles.find(prf => prf.get('akashaId') === akashaId);
                const profileAddress = profile ? profile.get('profile') : null;
                transactionActions.listenForMinedTx({ watch: false });
                transactionActions.deletePendingTx(unfollowTx);
                profileActions.isFollower(loggedAkashaId, akashaId);
                profileActions.getProfileData([{ profile: loggedProfile }], true);
                if (profileAddress) {
                    profileActions.getProfileData([{ profile: profileAddress }], true);
                }
                profileActions.unfollowProfileSuccess(akashaId);
                if (this.unfollowRequestTimeout) {
                    clearTimeout(this.unfollowRequestTimeout);
                }
            } else if (!followPending) {
                // profileActions.updateProfile();
                // transactionActions.listenForMinedTx();
                // transactionActions.addToQueue([{ tx: followTx, type: 'updateProfile' }]);
                // this.unfollowRequestTimeout = setTimeout(() => {
                //     const transactions = this.props.pendingTx.toJS().filter(tx =>
                //         tx.profile === loggedProfile && tx.type === 'updateProfile'
                //     );
                //     if (transactions.length > 0) {
                //         transactionActions.deletePendingTx(followTx);
                //         profileActions.deleteUpdateProfileTx(transactions[0].tx);
                //         transactionActions.listenForMinedTx({ watch: false });
                //         profileActions.updateProfileDataError({ message: 'transaction timeout' });
                //     }
                // }, 120000);
            }
        }
    }

    componentWillUnmount () {
        if (this.requestTimeout) {
            clearTimeout(this.requestTimeout);
        }
    }

    render () {
        return null;
    }
}

ProfileUpdater.propTypes = {
    profileActions: PropTypes.shape(),
    transactionActions: PropTypes.shape(),
    fetchingMined: PropTypes.bool,
    fetchingPending: PropTypes.bool,
    deletingPendingTx: PropTypes.bool,
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
        loggedProfileData: state.profileState.get('profiles').find(profile =>
            profile.get('profile') === state.profileState.getIn(['loggedProfile', 'profile'])),
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileUpdater);
