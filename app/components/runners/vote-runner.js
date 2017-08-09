import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import actionTypes from '../../constants/action-types';
import { pendingActionDelete, pendingActionUpdate } from '../../local-flux/actions/app-actions';
import { entryCanClaim, entryDownvote, entryDownvoteError, entryDownvoteSuccess, entryGetBalance,
    entryGetScore, entryGetVoteOf, entryUpvote, entryUpvoteError,
    entryUpvoteSuccess } from '../../local-flux/actions/entry-actions';
import { transactionDeletePending } from '../../local-flux/actions/transaction-actions';

class VoteRunner extends Component {

    componentWillReceiveProps (nextProps) {
        this.launchActions(nextProps);
        this.listenForMinedTx(nextProps);
    }

    launchActions = (nextProps) => {
        const { pendingActions } = nextProps;
        const actions = pendingActions.filter(action =>
            action.get('status') === 'readyToPublish');
        actions.forEach((action) => {
            const actionType = action.get('type');
            switch (actionType) {
                case actionTypes.upvote:
                    this.props.pendingActionUpdate(action.get('id'), { status: 'publishing' });
                    this.props.entryUpvote(
                        action.getIn(['payload', 'entryId']),
                        action.getIn(['payload', 'entryTitle']),
                        action.getIn(['payload', 'weight']),
                        action.getIn(['payload', 'value']),
                        action.get('gas')
                    );
                    break;
                case actionTypes.downvote:
                    this.props.pendingActionUpdate(action.get('id'), { status: 'publishing' });
                    this.props.entryDownvote(
                        action.getIn(['payload', 'entryId']),
                        action.getIn(['payload', 'entryTitle']),
                        action.getIn(['payload', 'weight']),
                        action.getIn(['payload', 'value']),
                        action.get('gas')
                    );
                    break;
                default:
                    break;
            }
        });
    };

    listenForMinedTx = (nextProps) => {
        const { deletingPendingTx, entries, fetchingMined, fetchingPending, fullEntry,
            loggedProfile, minedTx, pendingActions, pendingTx } = nextProps;
        const isNotFetching = !fetchingMined && !fetchingPending;
        const loggedAkashaId = loggedProfile.get('akashaId');
        const pendingTxs = isNotFetching ?
            pendingTx.filter(tx =>
                tx.akashaId === loggedAkashaId &&
                (tx.type === actionTypes.upvote || tx.type === actionTypes.downvote) &&
                !!minedTx.get(tx.tx) &&
                !deletingPendingTx.get(tx.tx)
            ) :
            [];

        pendingTxs.forEach((tx) => { // eslint-disable-line max-statements
            const correspondingAction = pendingActions.find(action =>
                action.get('type') === tx.type && action.get('status') === 'publishing');
            const entry = entries.get(tx.getIn(['extra', 'entryId']));
            const publisher = entry ?
                entry.getIn(['entryEth', 'publisher']) :
                fullEntry && fullEntry.getIn(['entryEth', 'publisher']);
            const minedSuccessfully = minedTx.get(tx.tx).cumulativeGasUsed < tx.gas;
            const entryId = tx.extra.entryId;
            const entryTitle = tx.extra.entryTitle;
            this.props.transactionDeletePending(tx.tx);
            if (tx.type === actionTypes.downvote) {
                if (minedSuccessfully) {
                    this.props.entryDownvoteSuccess({ entryId, entryTitle });
                } else {
                    this.props.entryDownvoteError({}, entryId, entryTitle);
                }
            } else if (minedSuccessfully) {
                this.props.entryUpvoteSuccess({ entryId, entryTitle });
            } else {
                this.props.entryUpvoteError({}, entryId, entryTitle);
            }
            this.props.entryGetScore(entryId);
            this.props.entryGetVoteOf(entryId);
            if (publisher === loggedProfile.get('profile')) {
                this.props.entryCanClaim(entryId);
                this.props.entryGetBalance(entryId);
            }
            if (correspondingAction) {
                this.props.pendingActionDelete(correspondingAction.get('id'));
            }
        });
    };
    render () {
        return null;
    }
}

VoteRunner.propTypes = {
    pendingActionDelete: PropTypes.func.isRequired,
    deletingPendingTx: PropTypes.shape(),
    entries: PropTypes.shape(),
    entryCanClaim: PropTypes.func.isRequired,
    entryDownvote: PropTypes.func.isRequired,
    entryDownvoteError: PropTypes.func.isRequired,
    entryDownvoteSuccess: PropTypes.func.isRequired,
    entryGetBalance: PropTypes.func.isRequired,
    entryGetScore: PropTypes.func.isRequired,
    entryGetVoteOf: PropTypes.func.isRequired,
    entryUpvote: PropTypes.func.isRequired,
    entryUpvoteError: PropTypes.func.isRequired,
    entryUpvoteSuccess: PropTypes.func.isRequired,
    fetchingMined: PropTypes.bool,
    fetchingPending: PropTypes.bool,
    fullEntry: PropTypes.shape(),
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
        entries: state.entryState.get('byId'),
        fetchingMined: state.transactionState.getIn(['flags', 'fetchingMined']),
        fetchingPending: state.transactionState.getIn(['flags', 'fetchingPending']),
        fullEntry: state.entryState.get('fullEntry'),
        loggedProfile: state.profileState.get('loggedProfile'),
        minedTx: state.transactionState.get('mined'),
        pendingActions: state.appState.get('pendingActions'),
        pendingTx: state.transactionState.get('pending'),
    };
}

export default connect(
    mapStateToProps,
    {
        pendingActionDelete,
        entryCanClaim,
        entryDownvote,
        entryDownvoteError,
        entryDownvoteSuccess,
        entryGetBalance,
        entryGetScore,
        entryGetVoteOf,
        entryUpvote,
        entryUpvoteError,
        entryUpvoteSuccess,
        transactionDeletePending,
        pendingActionUpdate
    }
)(VoteRunner);
