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
        const { minedTx, pendingTx, fetchingMined, fetchingPending, deletingPendingTx, appActions,
            entryActions, transactionActions, loggedProfile,
            pendingActions } = nextProps;
        const isNotFetching = !fetchingMined && !fetchingPending;
        const pendingSubsTxs = isNotFetching ?
            pendingTx.toJS().filter(tx =>
                tx.profile === loggedProfile.get('profile') && (tx.type === 'upvote' ||
                    tx.type === 'downvote')
            ) :
            [];

        pendingSubsTxs.forEach((tx) => {
            const isMined = minedTx.find(mined => mined.tx === tx.tx);
            if (isMined && !deletingPendingTx) {
                const correspondingAction = pendingActions.find(action =>
                    action.get('type') === tx.type && action.get('status') === 'publishing');
                transactionActions.deletePendingTx(tx.tx);
                // fire success action based on action type
                // WARNING: action must match `action.type + "Success"`
                // example: for action.type = 'upvote', success action
                // should be upvoteSuccess()
                if (typeof entryActions[`${tx.type}Success`] !== 'function') {
                    return console.error(`There is no action "${tx.type}Success" in entryActions!! Please implement "${tx.type}Success" action!!`);
                }
                entryActions[`${tx.type}Success`](tx.entryId);
                entryActions.getScore(tx.entryId);
                entryActions.getVoteOf(loggedProfile.get('akashaId'), tx.entryId);
                if (correspondingAction) {
                    appActions.deletePendingAction(correspondingAction.get('id'));
                }
            }
        });
    };
    render () {
        return null;
    }
}

VoteRunner.propTypes = {
    fetchingMined: PropTypes.bool,
    fetchingPending: PropTypes.bool,
    deletingPendingTx: PropTypes.bool,
    pendingActions: PropTypes.shape(),
    loggedProfile: PropTypes.shape(),
    transactionActions: PropTypes.shape(),
    appActions: PropTypes.shape(),
    entryActions: PropTypes.shape()
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
        entryActions: new EntryActions(dispatch),
        transactionActions: new TransactionActions(dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(VoteRunner);
