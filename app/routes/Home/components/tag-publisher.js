import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { AppActions, EntryActions, TagActions, TransactionActions } from 'local-flux';

class TagPublisher extends Component {
    componentWillReceiveProps (nextProps) {
        this.launchActions(nextProps);
        this.listenForMinedTx(nextProps);
    }

    launchActions = (nextProps) => {
        const { pendingActions, appActions, tagActions } = nextProps;
        const actions = pendingActions.filter(action =>
            action.get('status') === 'readyToPublish');
        if (actions.size > 0) {
            actions.forEach((action) => {
                const actionType = action.get('type');
                switch (actionType) {
                    case 'subscribeTag':
                        appActions.updatePendingAction(action.merge({
                            status: 'publishing'
                        }));
                        tagActions.subscribeTag(
                            action.getIn(['payload', 'tagName']), action.get('gas')
                        );
                        break;
                    case 'unsubscribeTag':
                        appActions.updatePendingAction(action.merge({
                            status: 'publishing'
                        }));
                        tagActions.unsubscribeTag(
                            action.getIn(['payload', 'tagName']), action.get('gas')
                        );
                        break;
                    case 'registerTag':
                        appActions.updatePendingAction(action.merge({
                            status: 'publishing'
                        }));
                        tagActions.registerTag(action.getIn(['payload', 'tagName']), action.get('gas'));
                        break;
                    default:
                        break;
                }
            });
        }
    };
    listenForMinedTx = (nextProps) => {
        const { minedTx, pendingTx, fetchingMined, fetchingPending, deletingPendingTx, appActions,
            entryActions, transactionActions, tagActions, loggedProfile,
            pendingActions } = nextProps;
        const isNotFetching = !fetchingMined && !fetchingPending;
        const pendingSubsTxs = isNotFetching ?
            pendingTx.toJS().filter(tx =>
                tx.profile === loggedProfile.get('profile') &&
                (tx.type === 'subscribeTag' || tx.type === 'unsubscribeTag'
                    || tx.type === 'registerTag') &&
                !!minedTx.find(mined => mined.tx === tx.tx) &&
                !deletingPendingTx.find(deleting => deleting.tx === tx.tx && deleting.value)
            ) :
            [];

        pendingSubsTxs.forEach((tx) => {
            const correspondingAction = pendingActions.find(action =>
                action.get('type') === tx.type && action.get('status') === 'publishing');
            transactionActions.deletePendingTx(tx.tx);
            // fire success action based on action type
            // WARNING: action must match `action.type + "Success"`
            // example: for action.type = 'registerTag', success action
            // should be registerTagSuccess()
            if (typeof tagActions[`${tx.type}Success`] !== 'function') {
                console.error(`There is no action "${tx.type}Success" in tagActions!! Please implement "${tx.type}Success" action!!`);
            } else {
                tagActions[`${tx.type}Success`](tx.tagName);
                appActions.deletePendingAction(correspondingAction.get('id'));
                entryActions.getEntriesStream(loggedProfile.get('akashaId'));
            }
        });
    };
    render () {
        return null;
    }
}

TagPublisher.propTypes = {
    fetchingMined: PropTypes.bool,
    fetchingPending: PropTypes.bool,
    deletingPendingTx: PropTypes.shape(),
    pendingActions: PropTypes.shape(),
    tagActions: PropTypes.shape(),
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
        tagActions: new TagActions(dispatch),
        transactionActions: new TransactionActions(dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TagPublisher);
