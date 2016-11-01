import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { AppActions, TransactionActions, ProfileActions } from 'local-flux';

class ProfileUpdater extends Component {
    constructor (props) {
        super(props);
        this.requestTimeout = null;
    }

    componentDidMount () {
        const { transactionActions, profileActions } = this.props;
        transactionActions.getPendingTransactions();
        transactionActions.getMinedTransactions();
        profileActions.getUpdateProfileTxs();
    }

    componentWillReceiveProps (nextProps) {
        const { fetchingMined, fetchingPending, fetchingUpdateProfileTxs, updateProfileTx,
            minedTx, profileActions, transactionActions, loggedProfile,
            deletingUpdateProfileTx, updatingProfile } = nextProps;
        const isNotFetching = !fetchingMined && !fetchingPending && !fetchingUpdateProfileTxs;
        if (isNotFetching && !deletingUpdateProfileTx && updateProfileTx.size) {
            const updateTx = updateProfileTx.toJS()[0].tx;
            const isMined = minedTx.find(mined => mined.tx === updateTx);
            if (isMined) {
                transactionActions.listenForMinedTx({ watch: false });
                profileActions.getProfileData([{ profile: loggedProfile }]);
                profileActions.updateProfileDataSuccess();
                profileActions.deleteUpdateProfileTx(updateTx);
                if (this.requestTimeout) {
                    clearTimeout(this.requestTimeout);
                }
            } else if (!updatingProfile) {
                profileActions.updateProfile();
                transactionActions.listenForMinedTx();
                transactionActions.addToQueue([updateTx]);
                this.requestTimeout = setTimeout(() => {
                    const transactions = this.props.updateProfileTx.toJS();
                    if (transactions.length > 0) {
                        profileActions.deleteUpdateProfileTx(transactions[0].tx);
                        transactionActions.listenForMinedTx({ watch: false });
                        profileActions.updateProfileDataSuccess();
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
    appActions: PropTypes.shape(),
    profileActions: PropTypes.shape(),
    transactionActions: PropTypes.shape(),
    fetchingMined: PropTypes.bool,
    fetchingPending: PropTypes.bool,
    fetchingUpdateProfileTxs: PropTypes.bool,
    deletingUpdateProfileTx: PropTypes.bool,
    updatingProfile: PropTypes.bool,
    updateProfileTx: PropTypes.shape(),
    minedTx: PropTypes.shape(),
    pendingTx: PropTypes.shape(),
    loggedProfile: PropTypes.string
};

function mapStateToProps (state, ownProps) {
    return {
        fetchingMined: state.transactionState.get('fetchingMined'),
        fetchingPending: state.transactionState.get('fetchingPending'),
        fetchingUpdateProfileTxs: state.profileState.getIn(['flags', 'fetchingUpdateProfileTx']),
        deletingUpdateProfileTx: state.profileState.getIn(['flags', 'deletingUpdateProfileTx']),
        updatingProfile: state.profileState.getIn(['flags', 'updatingProfile']),
        updateProfileTx: state.profileState.get('updateProfileTx'),
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
