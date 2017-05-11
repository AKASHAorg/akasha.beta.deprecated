import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import actionTypes from '../../constants/action-types';
import { deletePendingAction, updateAction } from '../../local-flux/actions/app-actions';
import { commentsPublish, commentsPublishError,
    commentsPublishSuccess } from '../../local-flux/actions/comments-actions';
import { transactionDeletePending } from '../../local-flux/actions/transaction-actions';

class CommentsPublisher extends Component {
    componentWillReceiveProps (nextProps) {
        this.launchActions(nextProps);
        this.listenForMinedTx(nextProps);
    }

    launchActions = (nextProps) => {
        const { pendingActions } = nextProps;
        const actions = pendingActions.filter(action =>
            action.get('status') === 'readyToPublish' && action.get('type') === actionTypes.comment);
        actions.forEach((action) => {
            const id = action.get('id');
            this.props.updateAction(id, { status: 'publishing' });
            this.props.commentsPublish(action.get('payload').set('actionId', id), action.get('gas'));
        });
    };

    listenForMinedTx = (nextProps) => {
        const { deletingPendingTx, fetchingMined, fetchingPending, loggedProfile, minedTx,
            pendingTx } = nextProps;
        const isNotFetching = !fetchingMined && !fetchingPending;
        const loggedAkashaId = loggedProfile.get('akashaId');
        const pendingTxs = isNotFetching ?
            pendingTx.filter(tx =>
                tx.akashaId === loggedAkashaId &&
                tx.type === actionTypes.comment &&
                !!minedTx.get(tx.tx) &&
                !deletingPendingTx.get(tx.tx)
            ) :
            [];
        pendingTxs.forEach((tx) => {
            const minedSuccessfully = minedTx.get(tx.tx).cumulativeGasUsed < tx.gas;
            this.props.transactionDeletePending(tx.tx);
            if (tx.mentions && tx.mentions.length) {
                // Using hardcoded string to simulate comment id. This is used for sending
                // the correct notification type.
                // notificationsActions.sendMention(tx.mentions, tx.entryId, 'id');
            }
            if (minedSuccessfully) {
                this.props.commentsPublishSuccess(tx);
            } else {
                this.props.commentsPublishError({});
            }
            if (tx.extra.actionId) {
                this.props.deletePendingAction(tx.extra.actionId);
            }
        });
    };

    render () {
        return null;
    }
}

CommentsPublisher.propTypes = {
    commentsPublish: PropTypes.func.isRequired,
    commentsPublishError: PropTypes.func.isRequired,
    commentsPublishSuccess: PropTypes.func.isRequired,
    deletePendingAction: PropTypes.func.isRequired,
    deletingPendingTx: PropTypes.shape(),
    fetchingMined: PropTypes.bool,
    fetchingPending: PropTypes.bool,
    loggedProfile: PropTypes.shape(),
    minedTx: PropTypes.shape(),
    pendingTx: PropTypes.shape(),
    pendingActions: PropTypes.shape(),
    transactionDeletePending: PropTypes.func.isRequired,
    updateAction: PropTypes.func.isRequired
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
        commentsPublish,
        commentsPublishError,
        commentsPublishSuccess,
        deletePendingAction,
        transactionDeletePending,
        updateAction
    }
)(CommentsPublisher);
