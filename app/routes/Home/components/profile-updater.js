import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { AppActions, TransactionActions, ProfileActions } from 'local-flux';

class ProfileUpdater extends Component {
    constructor (props) {
        super(props);
        this.requestTimeout = null;
    }

    componentWillReceiveProps (nextProps) {
        const { fetchingMined, fetchingPending, minedTx, pendingTx, profileActions,
            transactionActions, loggedProfile, updatingProfile, deletingPendingTx } = nextProps;
        const isNotFetching = !fetchingMined && !fetchingPending;
        const pendingUpdateProfileTx = isNotFetching ?
            pendingTx.toJS().filter(tx =>
                tx.profile === loggedProfile && tx.type === 'updateProfile'
            ) :
            [];
        if (pendingUpdateProfileTx.length) {
            const updateTx = pendingUpdateProfileTx[0].tx;
            const isMined = minedTx.find(mined => mined.tx === updateTx);
            if (isMined && !deletingPendingTx) {
                transactionActions.listenForMinedTx({ watch: false });
                transactionActions.deletePendingTx(updateTx);
                profileActions.getProfileData([{ profile: loggedProfile }], true);
                profileActions.updateProfileDataSuccess();
                if (this.requestTimeout) {
                    clearTimeout(this.requestTimeout);
                }
            } else if (!updatingProfile) {
                profileActions.updateProfile();
                transactionActions.listenForMinedTx();
                transactionActions.addToQueue([{ tx: updateTx, type: 'updateProfile' }]);
                this.requestTimeout = setTimeout(() => {
                    const transactions = this.props.pendingTx.toJS().filter(tx =>
                        tx.profile === loggedProfile && tx.type === 'updateProfile'
                    );
                    if (transactions.length > 0) {
                        transactionActions.deletePendingTx(updateTx);
                        profileActions.deleteUpdateProfileTx(transactions[0].tx);
                        transactionActions.listenForMinedTx({ watch: false });
                        profileActions.updateProfileDataError({ message: 'transaction timeout' });
                    }
                }, 120000);
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
    updatingProfile: PropTypes.bool,
    minedTx: PropTypes.shape(),
    pendingTx: PropTypes.shape(),
    loggedProfile: PropTypes.string
};

function mapStateToProps (state, ownProps) {
    return {
        fetchingMined: state.transactionState.get('fetchingMined'),
        fetchingPending: state.transactionState.get('fetchingPending'),
        updatingProfile: state.profileState.getIn(['flags', 'updatingProfile']),
        deletingPendingTx: state.profileState.getIn(['flags', 'deletingPendingTx']),
        minedTx: state.transactionState.get('mined'),
        pendingTx: state.transactionState.get('pending'),
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
