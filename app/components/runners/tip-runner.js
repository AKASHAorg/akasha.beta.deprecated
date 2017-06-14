import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import actionTypes from '../../constants/action-types';
import { deletePendingAction, showNotification,
    updateAction } from '../../local-flux/actions/app-actions';
import { profileSendTip, profileSendTipError,
    profileSendTipSuccess } from '../../local-flux/actions/profile-actions';
import { transactionDeletePending } from '../../local-flux/actions/transaction-actions';
import { selectLoggedAkashaId } from '../../local-flux/selectors';

class TipRunner extends Component {

    componentWillReceiveProps (nextProps) {
        this.launchActions(nextProps);
        this.listenForMinedTx(nextProps);
    }

    launchActions = (nextProps) => {
        const { pendingActions } = nextProps;
        const actions = pendingActions.filter(action =>
            action.status === 'readyToPublish' &&
            action.type === actionTypes.sendTip
        );
        actions.forEach((action) => {
            const payload = action.payload ? action.payload.toJS() : {};
            this.props.updateAction(action.id, { status: 'publishing' });
            this.props.profileSendTip(
                payload.akashaId,
                payload.profile,
                payload.value,
                action.gas
            );
        });
    };

    listenForMinedTx = (nextProps) => {
        const { minedTx, pendingTx, fetchingMined, fetchingPending, deletingPendingTx,
            loggedAkashaId, pendingActions } = nextProps;
        const isNotFetching = !fetchingMined && !fetchingPending;
        const pendingTxs = isNotFetching ?
            pendingTx.filter(tx =>
                tx.akashaId === loggedAkashaId &&
                tx.type === actionTypes.sendTip &&
                !!minedTx.get(tx.tx) &&
                !deletingPendingTx.get(tx.tx)
            ) :
            [];

        pendingTxs.forEach((tx) => {
            const correspondingAction = pendingActions.find(action =>
                action.get('type') === tx.type && action.get('status') === 'publishing');
            const minedSuccessfully = minedTx.get(tx.tx).cumulativeGasUsed < tx.gas;
            this.props.transactionDeletePending(tx.tx);
            if (minedSuccessfully) {
                this.props.profileSendTipSuccess({ akashaId: tx.extra.akashaId });
                this.props.showNotification({
                    id: 'sendTipSuccess',
                    values: { akashaId: tx.extra.akashaId }
                });
            } else {
                this.props.profileSendTipError({}, tx.extra.akashaId);
            }
            if (correspondingAction) {
                this.props.deletePendingAction(correspondingAction.get('id'));
            }
        });
    };

    render () {
        return null;
    }
}

TipRunner.propTypes = {
    deletePendingAction: PropTypes.func.isRequired,
    deletingPendingTx: PropTypes.shape(),
    fetchingMined: PropTypes.bool,
    fetchingPending: PropTypes.bool,
    loggedAkashaId: PropTypes.string,
    minedTx: PropTypes.shape(),
    pendingActions: PropTypes.shape(),
    pendingTx: PropTypes.shape(),
    profileSendTip: PropTypes.func.isRequired,
    profileSendTipError: PropTypes.func.isRequired,
    profileSendTipSuccess: PropTypes.func.isRequired,
    showNotification: PropTypes.func.isRequired,
    transactionDeletePending: PropTypes.func.isRequired,
    updateAction: PropTypes.func.isRequired
};

function mapStateToProps (state) {
    return {
        fetchingMined: state.transactionState.get('fetchingMined'),
        fetchingPending: state.transactionState.get('fetchingPending'),
        deletingPendingTx: state.transactionState.getIn(['flags', 'deletingPendingTx']),
        loggedAkashaId: selectLoggedAkashaId(state),
        pendingActions: state.appState.get('pendingActions'),
        pendingTx: state.transactionState.get('pending'),
        minedTx: state.transactionState.get('mined')
    };
}

export default connect(
    mapStateToProps,
    {
        deletePendingAction,
        profileSendTip,
        profileSendTipError,
        profileSendTipSuccess,
        showNotification,
        transactionDeletePending,
        updateAction
    }
)(TipRunner);
