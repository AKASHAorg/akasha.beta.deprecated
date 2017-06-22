import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import actionTypes from '../../constants/action-types';
import { deletePendingAction, pendingActionUpdate } from '../../local-flux/actions/app-actions';
import { profileFollow, profileFollowError, profileFollowSuccess, profileUnfollow,
    profileUnfollowError, profileUnfollowSuccess } from '../../local-flux/actions/profile-actions';
import { transactionDeletePending } from '../../local-flux/actions/transaction-actions';
import { selectLoggedAkashaId } from '../../local-flux/selectors';

class FollowRunner extends Component {

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
            const payload = action.get('payload') ? action.get('payload').toJS() : {};
            switch (actionType) {
                case actionTypes.follow:
                    this.props.pendingActionUpdate(action.get('id'), { status: 'publishing' });
                    this.props.profileFollow(payload.akashaId, action.gas, payload.profile);
                    break;
                case actionTypes.unfollow:
                    this.props.pendingActionUpdate(action.get('id'), { status: 'publishing' });
                    this.props.profileUnfollow(payload.akashaId, action.gas, payload.profile);
                    break;
                default:
                    break;
            }
        });
    };

    listenForMinedTx = (nextProps) => {
        const { deletingPendingTx, fetchingMined, fetchingPending, loggedAkashaId, minedTx,
            pendingActions, pendingTx } = nextProps;
        const isNotFetching = !fetchingMined && !fetchingPending;
        const pendingFollowTxs = isNotFetching ?
            pendingTx.filter(tx =>
                tx.akashaId === loggedAkashaId &&
                (tx.type === actionTypes.follow || tx.type === actionTypes.unfollow) &&
                !!minedTx.get(tx.tx) &&
                !deletingPendingTx.get(tx.tx)
            ) :
            [];

        pendingFollowTxs.forEach((tx) => {
            const correspondingAction = pendingActions.find(action =>
                action.get('type') === tx.type &&
                action.get('status') === 'publishing' &&
                action.getIn(['payload', 'akashaId']) === tx.extra.akashaId
            );
            const minedSuccessfully = minedTx.get(tx.tx).cumulativeGasUsed < tx.gas;
            this.props.transactionDeletePending(tx.tx);
            if (tx.type === actionTypes.follow) {
                if (minedSuccessfully) {
                    this.props.profileFollowSuccess(tx.extra.akashaId);
                    this.props.showNotification({
                        id: 'followProfileSuccess',
                        values: { akashaId: tx.extra.akashaId }
                    });
                } else {
                    this.props.profileFollowError({}, tx.extra.akashaId);
                }
            } else if (minedSuccessfully) {
                this.props.profileUnfollowSuccess(tx.extra.akashaId);
                this.props.showNotification({
                    id: 'unfollowProfileSuccess',
                    values: { akashaId: tx.extra.akashaId }
                });
            } else {
                this.props.profileUnfollowError({}, tx.extra.akashaId);
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

FollowRunner.propTypes = {
    deletePendingAction: PropTypes.func.isRequired,
    deletingPendingTx: PropTypes.shape(),
    fetchingMined: PropTypes.bool,
    fetchingPending: PropTypes.bool,
    loggedAkashaId: PropTypes.string,
    minedTx: PropTypes.shape(),
    pendingActions: PropTypes.shape(),
    pendingTx: PropTypes.shape(),
    profileFollow: PropTypes.func.isRequired,
    profileFollowError: PropTypes.func.isRequired,
    profileFollowSuccess: PropTypes.func.isRequired,
    profileUnfollow: PropTypes.func.isRequired,
    profileUnfollowError: PropTypes.func.isRequired,
    profileUnfollowSuccess: PropTypes.func.isRequired,
    showNotification: PropTypes.func.isRequired,
    transactionDeletePending: PropTypes.func.isRequired,
    pendingActionUpdate: PropTypes.func.isRequired,
};

function mapStateToProps (state) {
    return {
        deletingPendingTx: state.transactionState.getIn(['flags', 'deletingPendingTx']),
        fetchingMined: state.transactionState.getIn(['flags', 'fetchingMined']),
        fetchingPending: state.transactionState.getIn(['flags', 'fetchingPending']),
        loggedAkashaId: selectLoggedAkashaId(state),
        minedTx: state.transactionState.get('mined'),
        pendingActions: state.appState.get('pendingActions'),
        pendingTx: state.transactionState.get('pending'),
    };
}

export default connect(
    mapStateToProps,
    {
        deletePendingAction,
        profileFollow,
        profileFollowError,
        profileFollowSuccess,
        profileUnfollow,
        profileUnfollowError,
        profileUnfollowSuccess,
        transactionDeletePending,
        pendingActionUpdate
    }
)(FollowRunner);
