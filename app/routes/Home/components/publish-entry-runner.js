import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { DraftActions, AppActions, TransactionActions, EntryActions } from 'local-flux';

class PublishEntryRunner extends Component {
    componentWillReceiveProps (nextProps) {
        this.launchActions(nextProps);
        this.listenMinedTx(nextProps);
    }
    launchActions = (nextProps) => {
        const { pendingActions, appActions, draftActions } = nextProps;
        const actions = pendingActions.filter(action => action.get('status') === 'readyToPublish');
        if (actions.size > 0) {
            actions.forEach((action) => {
                // switch may seem unnecessary right now but it will be used for edit too!
                switch (action.get('type')) {
                    case 'publishEntry':
                        appActions.updatePendingAction(action.mergeDeep({
                            status: 'publishing'
                        }));
                        draftActions.publishDraft(action.getIn(['payload', 'draft']), action.get('gas'));
                        break;
                    default:
                        break;
                }
            });
        }
    }
    listenMinedTx = (nextProps) => {
        const { minedTx, pendingTx, fetchingMined, fetchingPending, deletingPendingTx, appActions,
            draftActions, transactionActions, loggedProfile,
            pendingActions, entryActions } = nextProps;
        const isNotFetching = !fetchingMined && !fetchingPending;
        const pendingSubsTxs = isNotFetching ?
            pendingTx.toJS().filter(tx =>
                tx.profile === loggedProfile.get('profile') && (tx.type === 'publishEntry')) :
                [];

        pendingSubsTxs.forEach((tx) => {
            const isMined = minedTx.find(mined => mined.tx === tx.tx);
            if (isMined && !deletingPendingTx) {
                const correspondingAction = pendingActions.find(action =>
                    action.get('type') === tx.type && action.get('status') === 'publishing');
                transactionActions.deletePendingTx(tx.tx);
                // fire success action based on action type
                // WARNING: action must match `action.type + "Success"`
                // example: for action.type = 'registerTag', success action
                // should be registerTagSuccess()
                if (typeof draftActions[`${tx.type}Success`] !== 'function') {
                    console.error(
                        `There is no action "${tx.type}Success" in draftActions!!
                        Please implement "${tx.type}Success" action!!`
                    );
                } else {
                    draftActions[`${tx.type}Success`](tx.draftId);
                    appActions.deletePendingAction(correspondingAction.get('id'));
                    entryActions.getEntriesStream(loggedProfile.get('akashaId'));
                }
            }
        });
    };
    render () {
        return null;
    }
}

PublishEntryRunner.propTypes = {
    draftActions: PropTypes.shape(),
    appActions: PropTypes.shape(),
    loggedProfile: PropTypes.shape(),
    transactionActions: PropTypes.shape(),
    minedTx: PropTypes.shape()

};

function mapStateToProps (state) {
    return {
        fetchingMined: state.transactionState.get('fetchingMined'),
        fetchingPending: state.transactionState.get('fetchingPending'),
        deletingPendingTx: state.transactionState.getIn(['flags', 'deletingPendingTx']),
        loggedProfile: state.profileState.get('loggedProfile'),
        loggedProfileData: state.profileState.get('profiles').find(prf =>
            prf.get('profile') === state.profileState.getIn(['loggedProfile', 'profile'])),
        drafts: state.draftState.get('drafts'),
        minedTx: state.transactionState.get('mined'),
        pendingTx: state.transactionState.get('pending'),
        pendingActions: state.appState.get('pendingActions'),
    };
}

function mapDispatchToProps (dispatch) {
    return {
        draftActions: new DraftActions(dispatch),
        appActions: new AppActions(dispatch),
        entryActions: new EntryActions(dispatch),
        transactionActions: new TransactionActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PublishEntryRunner);
