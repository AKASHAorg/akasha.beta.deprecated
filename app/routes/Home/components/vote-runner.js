import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { AppActions, EntryActions, TagActions, TransactionActions } from 'local-flux';

class VoteRunner extends Component {

    componentWillReceiveProps (nextProps) {
        this.launchActions(nextProps);
        this.listenForMinedTx(nextProps);
    }

    launchActions = (nextProps) => {
        const { pendingActions, appActions, entryActions } = nextProps;
        const actions = pendingActions.filter(action =>
            action.get('status') === 'readyToPublish');
        if (actions.size > 0) {
            actions.forEach((action) => {
                const actionType = action.get('type');
                switch (actionType) {
                    case 'upvote':
                        appActions.updatePendingAction(action.merge({
                            status: 'publishing'
                        }));
                        entryActions.upvote(
                            action.getIn(['payload', 'entryId']),
                            action.getIn(['payload', 'entryTitle']),
                            action.getIn(['payload', 'weight']),
                            action.getIn(['payload', 'value']),
                            action.get('gas')
                        );
                        break;
                    case 'downvote':
                        appActions.updatePendingAction(action.merge({
                            status: 'publishing'
                        }));
                        entryActions.downvote(
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
        }
    };
    listenForMinedTx = (nextProps) => {
        const { appActions, deletingPendingTx, entries, entryActions, fetchingMined,
            fetchingPending, fullEntry, loggedProfile, minedTx, pendingActions, pendingTx,
            transactionActions } = nextProps;
        const isNotFetching = !fetchingMined && !fetchingPending;
        const pendingTxs = isNotFetching ?
            pendingTx.toJS().filter(tx =>
                tx.profile === loggedProfile.get('profile') &&
                (tx.type === 'upvote' || tx.type === 'downvote') &&
                !!minedTx.find(mined => mined.tx === tx.tx) &&
                !deletingPendingTx.find(deleting => deleting.tx === tx.tx && deleting.value)
            ) :
            [];

        pendingTxs.forEach((tx) => {
            const correspondingAction = pendingActions.find(action =>
                action.get('type') === tx.type && action.get('status') === 'publishing');
            const entry = entries.find(entry => entry.get('entryId') === tx.entryId);
            const publisherAkashaId = entry ?
                entry.getIn(['entryEth', 'publisher', 'akashaId']) :
                fullEntry ? fullEntry.entryEth.publisher.akashaId : null;
            const loggedAkashaId = loggedProfile.get('akashaId');
            const mined = minedTx.find(mined => mined.tx === tx.tx);
            let minedSuccessfully;
            if (correspondingAction) {
                minedSuccessfully = mined.cumulativeGasUsed < correspondingAction.get('gas');
            }
            transactionActions.deletePendingTx(tx.tx);
            // fire success action based on action type
            // WARNING: action must match `action.type + "Success"`
            // example: for action.type = 'upvote', success action
            // should be upvoteSuccess()
            if (typeof entryActions[`${tx.type}Success`] !== 'function') {
                return console.error(`There is no action "${tx.type}Success" in entryActions!! Please implement "${tx.type}Success" action!!`);
            }
            entryActions[`${tx.type}Success`](tx.entryId, tx.entryTitle, minedSuccessfully);
            entryActions.getScore(tx.entryId);
            entryActions.getVoteOf(loggedProfile.get('akashaId'), tx.entryId);
            if (publisherAkashaId === loggedAkashaId) {
                entryActions.canClaim(tx.entryId);
                entryActions.getEntryBalance(tx.entryId);
            }
            if (correspondingAction) {
                appActions.deletePendingAction(correspondingAction.get('id'));
            }
        });
    };
    render () {
        return null;
    }
}

VoteRunner.propTypes = {
    appActions: PropTypes.shape(),
    deletingPendingTx: PropTypes.shape(),
    entries: PropTypes.shape(),
    entryActions: PropTypes.shape(),
    fetchingMined: PropTypes.bool,
    fetchingPending: PropTypes.bool,
    loggedProfile: PropTypes.shape(),
    minedTx: PropTypes.shape(),
    pendingActions: PropTypes.shape(),
    pendingTx: PropTypes.shape(),
    transactionActions: PropTypes.shape(),
};

function mapStateToProps (state) {
    return {
        deletingPendingTx: state.transactionState.getIn(['flags', 'deletingPendingTx']),
        entries: state.entryState.get('entries').map(entry => entry.get('content')),
        fetchingMined: state.transactionState.get('fetchingMined'),
        fetchingPending: state.transactionState.get('fetchingPending'),
        fullEntry: state.entryState.get('fullEntry'),
        loggedProfile: state.profileState.get('loggedProfile'),
        minedTx: state.transactionState.get('mined'),
        pendingActions: state.appState.get('pendingActions'),
        pendingTx: state.transactionState.get('pending'),
    };
}

function mapDispatchToProps (dispatch) {
    return {
        appActions: new AppActions(dispatch),
        entryActions: new EntryActions(dispatch),
        transactionActions: new TransactionActions(dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(VoteRunner);
