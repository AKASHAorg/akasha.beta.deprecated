import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { AppActions, ProfileActions, TransactionActions } from 'local-flux';

class TipRunner extends Component {

    componentWillReceiveProps (nextProps) {
        this.launchActions(nextProps);
        this.listenForMinedTx(nextProps);
    }

    launchActions = (nextProps) => {
        const { appActions, pendingActions, profileActions } = nextProps;
        const actions = pendingActions.filter(action =>
            action.get('status') === 'readyToPublish' && action.get('type') === 'sendTip');
        if (actions.size > 0) {
            actions.forEach((action) => {
                appActions.updatePendingAction(action.merge({
                    status: 'publishing'
                }));
                profileActions.sendTip(
                    action.getIn(['payload', 'akashaId']),
                    action.getIn(['payload', 'profile']),
                    action.getIn(['payload', 'eth']),
                    action.get('gas'),
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
                tx.profile === loggedProfile.get('profile') &&
                tx.type === 'sendTip' &&
                !!minedTx.find(mined => mined.tx === tx.tx) &&
                !deletingPendingTx.find(deleting => deleting.tx === tx.tx && deleting.value)
            ) :
            [];

        pendingTxs.forEach((tx) => {
            const correspondingAction = pendingActions.find(action =>
                action.get('type') === tx.type && action.get('status') === 'publishing');
            const mined = minedTx.find(mnd => mnd.tx === tx.tx);
            const minedSuccessfully = mined.cumulativeGasUsed < tx.gas;
            transactionActions.deletePendingTx(tx.tx);
            profileActions.sendTipSuccess(tx.akashaId, minedSuccessfully);
            if (correspondingAction) {
                appActions.deletePendingAction(correspondingAction.get('id'));
            }
        });
    };
    render () {
        return null;
    }
}

TipRunner.propTypes = {
    fetchingMined: PropTypes.bool,
    fetchingPending: PropTypes.bool,
    deletingPendingTx: PropTypes.shape(),
    pendingActions: PropTypes.shape(),
    loggedProfile: PropTypes.shape(),
    transactionActions: PropTypes.shape(),
    appActions: PropTypes.shape(),
};

function mapStateToProps (state) {
    return {
        fetchingMined: state.transactionState.get('fetchingMined'),
        fetchingPending: state.transactionState.get('fetchingPending'),
        deletingPendingTx: state.transactionState.getIn(['flags', 'deletingPendingTx']),
        loggedProfile: state.profileState.get('loggedProfile'),
        loggedProfileData: state.profileState.get('profiles').find(prf =>
            prf.get('profile') === state.profileState.getIn(['loggedProfile', 'profile'])),
        pendingActions: state.appState.get('pendingActions'),
        pendingTx: state.transactionState.get('pending'),
        minedTx: state.transactionState.get('mined')
    };
}

function mapDispatchToProps (dispatch) {
    return {
        appActions: new AppActions(dispatch),
        profileActions: new ProfileActions(dispatch),
        transactionActions: new TransactionActions(dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TipRunner);
