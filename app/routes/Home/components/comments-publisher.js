import { Component } from 'react';
import { connect } from 'react-redux';
import { AppActions, CommentsActions, NotificationsActions, TransactionActions } from 'local-flux';

class CommentsPublisher extends Component {
    componentWillReceiveProps (nextProps) {
        this.launchActions(nextProps);
        this.listenForMinedTx(nextProps);
    }
    launchActions = (nextProps) => {
        const { pendingActions, appActions, commentsActions } = nextProps;
        const actions = pendingActions.filter(action =>
            action.get('status') === 'readyToPublish');
        if (actions.size > 0) {
            actions.forEach((action) => {
                const actionType = action.get('type');
                switch (actionType) {
                    case 'publishComment':
                        appActions.updatePendingAction(action.merge({
                            status: 'publishing'
                        }));
                        commentsActions.publishComment(action.get('payload'), action.get('gas'));
                        break;
                    default:
                        break;
                }
            });
        }
    }
    listenForMinedTx = (nextProps) => {
        const { minedTx, pendingTx, fetchingMined, fetchingPending, deletingPendingTx, appActions,
            transactionActions, commentsActions, loggedProfile, pendingActions,
            notificationsActions } = nextProps;
        const isNotFetching = !fetchingMined && !fetchingPending;
        const pendingSubsTxs = isNotFetching ?
            pendingTx.toJS().filter(tx =>
                tx.profile === loggedProfile.get('profile') &&
                tx.type === 'publishComment' &&
                !!minedTx.find(mined => mined.tx === tx.tx) &&
                !deletingPendingTx.find(deleting => deleting.tx === tx.tx && deleting.value)
            ) :
            [];
        pendingSubsTxs.forEach((tx) => {
            const correspondingAction = pendingActions.find(action =>
                action.get('type') === tx.type && action.get('status') === 'publishing');
            transactionActions.deletePendingTx(tx.tx);
            if (tx.mentions && tx.mentions.length) {
                // Using hardcoded string to simulate comment id. This is used for sending
                // the correct notification type.
                notificationsActions.sendMention(tx.mentions, tx.entryId, 'fakeCommentId');
            }
            // fire success action based on action type
            // WARNING: action must match `action.type + "Success"`
            // example: for action.type = 'registerTag', success action
            // should be registerTagSuccess()
            if (typeof commentsActions[`${tx.type}Success`] !== 'function') {
                console.error(`There is no action "${tx.type}Success" in commentsActions!! Please implement "${tx.type}Success" action!!`);
            } else {
                commentsActions[`${tx.type}Success`](tx);
                appActions.deletePendingAction(correspondingAction.get('id'));
            }
        });
    }
    render () {
        return null;
    }
}

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
        minedTx: state.transactionState.get('mined'),
    };
}

function mapDispatchToProps (dispatch) {
    return {
        appActions: new AppActions(dispatch),
        commentsActions: new CommentsActions(dispatch),
        notificationsActions: new NotificationsActions(dispatch),
        transactionActions: new TransactionActions(dispatch),
    };
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CommentsPublisher);
