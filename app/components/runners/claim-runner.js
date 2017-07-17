import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { deletePendingAction, pendingActionUpdate } from '../../local-flux/actions/app-actions';
import { entryCanClaim, entryClaim, entryClaimError, entryClaimSuccess,
    entryGetBalance } from '../../local-flux/actions/entry-actions';
import { transactionDeletePending } from '../../local-flux/actions/transaction-actions';
import actionTypes from '../../constants/action-types';

class ClaimRunner extends Component {
    componentWillReceiveProps (nextProps) {
        this.launchActions(nextProps);
        this.listenForMinedTx(nextProps);
    }

    launchActions = (nextProps) => {
        const { pendingActions } = nextProps;
        const actions = pendingActions.filter(action =>
            action.get('status') === 'readyToPublish' && action.get('type') === actionTypes.claim);
        actions.forEach((action) => {
            this.props.pendingActionUpdate(action.get('id'), { status: 'publishing' });
            this.props.entryClaim(
                action.getIn(['payload', 'entryId']),
                action.getIn(['payload', 'entryTitle']),
                action.get('gas')
            );
        });
    };

    listenForMinedTx = (nextProps) => {
        const { deletingPendingTx, fetchingMined, fetchingPending,
            loggedProfile, minedTx, pendingActions, pendingTx } = nextProps;
        const isNotFetching = !fetchingMined && !fetchingPending;
        const loggedAkashaId = loggedProfile.get('akashaId');
        const pendingTxs = isNotFetching ?
            pendingTx.filter(tx =>
                tx.akashaId === loggedAkashaId &&
                tx.type === actionTypes.claim &&
                !!minedTx.get(tx.tx) &&
                !deletingPendingTx.get(tx.tx)
            ) :
            [];

        pendingTxs.forEach((tx) => {
            const correspondingAction = pendingActions.find(action =>
                action.get('type') === tx.type && action.get('status') === 'publishing');
            const minedSuccessfully = minedTx.get(tx.tx).cumulativeGasUsed < tx.gas;
            this.props.transactionDeletePending(tx.tx);
            const entryId = tx.extra.entryId;
            const entryTitle = tx.extra.entryTitle;
            if (minedSuccessfully) {
                this.props.entryClaimSuccess({ entryId, entryTitle });
            } else {
                this.props.entryClaimError({}, entryId, entryTitle);
            }
            this.props.entryCanClaim(entryId);
            this.props.entryGetBalance(entryId);
            if (correspondingAction) {
                this.props.deletePendingAction(correspondingAction.get('id'));
            }
        });
    };
    render () {
        return null;
    }
}

ClaimRunner.propTypes = {
    deletePendingAction: PropTypes.func.isRequired,
    deletingPendingTx: PropTypes.shape(),
    entryCanClaim: PropTypes.func.isRequired,
    entryClaim: PropTypes.func.isRequired,
    entryClaimError: PropTypes.func.isRequired,
    entryClaimSuccess: PropTypes.func.isRequired,
    entryGetBalance: PropTypes.func.isRequired,
    fetchingMined: PropTypes.bool,
    fetchingPending: PropTypes.bool,
    loggedProfile: PropTypes.shape(),
    minedTx: PropTypes.shape(),
    pendingActions: PropTypes.shape(),
    pendingTx: PropTypes.shape(),
    transactionDeletePending: PropTypes.func.isRequired,
    pendingActionUpdate: PropTypes.func.isRequired
};

function mapStateToProps (state) {
    return {
        deletingPendingTx: state.transactionState.getIn(['flags', 'deletingPendingTx']),
        fetchingMined: state.transactionState.getIn(['flags', 'fetchingMined']),
        fetchingPending: state.transactionState.getIn(['flags', 'fetchingPending']),
        loggedProfile: state.profileState.get('loggedProfile'),
        minedTx: state.transactionState.get('mined'),
        pendingActions: state.appState.get('pendingActions'),
        pendingTx: state.transactionState.get('pending'),
    };
}

export default connect(
    mapStateToProps,
    {
        deletePendingAction,
        entryCanClaim,
        entryClaim,
        entryClaimError,
        entryClaimSuccess,
        entryGetBalance,
        transactionDeletePending,
        pendingActionUpdate
    }
)(ClaimRunner);
