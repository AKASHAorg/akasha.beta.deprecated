import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { DraftActions, AppActions, TransactionActions } from 'local-flux';
/**
 * This component will publish entries in parallel
 * main logic of entry publishing steps will be here
 * @TODO: Create some kind of queue and a task runner to be used for profile creation too
 *
 */
class PublishEntryRunner extends Component {
    componentWillMount () {
        // const { transactionActions, loggedProfile, draftActions } = this.props;
        // transactionActions.getPendingTransactions();
        // transactionActions.getMinedTransactions();
        // draftActions.getPublishingDrafts(loggedProfile.get('profile'));
    }
    componentWillReceiveProps (nextProps) {
        const { drafts, appActions, loggedProfile, draftActions, transactionActions,
            minedTransactions } = nextProps;
        this.launchActions(nextProps);
        this.listenMinedTx(nextProps);
        // let publishableDrafts = [];
        // if (drafts.size > 0) {
        //     publishableDrafts = drafts.filter(draft =>
        //         draft.status.publishing && draft.status.publishingConfirmed);
        // }
        // if (publishableDrafts.size > 0) {
        //     publishableDrafts.forEach((draft) => {
        //         const { status } = draft;
        //         if (status.currentAction === 'checkLogin' && status.publishing && status.publishingConfirmed) {
        //             const tokenIsValid = this._verifyExpiration(loggedProfile.get('expiration'));
        //             if (tokenIsValid) {
        //                 return this._registerDraft(draft, loggedProfile.get('token'));
        //             }
        //             return appActions.showAuthDialog();
        //         }
        //         if (status.currentAction === 'draftPublished' && draft.tx) {
        //             return this._checkForTx(draft);
        //         }
        //         if (status.currentAction === 'listeningTx' &&
        //                 minedTransactions.findIndex(minedTx => minedTx.tx === draft.tx) !== -1) {
        //             // delete draft and pendingTxs
        //             draftActions.deleteDraft(draft.id);
        //             transactionActions.deletePendingTx(draft.tx);
        //         }
        //     });
        // }
    }
    launchActions = (nextProps) => {
        const { pendingActions, appActions, draftActions } = nextProps;
        const actions = pendingActions.filter(action => action.get('status') === 'readyToPublish');
        if (actions.size > 0) {
            actions.forEach((action) => {
                // switch may seem unneccessary right now but it will be used for edit too!
                switch (action.get('type')) {
                    case 'publishEntry':
                        appActions.updatePendingAction(action.merge({
                            status: 'publishing'
                        }));
                        draftActions.publishDraft(action.get('payload'), action.get('gas'));
                        break;
                    default:
                        break;
                }
            });
        }
    }
    listenMinedTx = (nextProps) => {};
    _registerDraft = (draft, token) => {
        const { draftActions } = this.props;
        draftActions.publishDraft(draft.toJS(), token);
    }
    render () {
        return null;
    }
}

PublishEntryRunner.propTypes = {
    drafts: PropTypes.shape(),
    draftActions: PropTypes.shape(),
    appActions: PropTypes.shape(),
    loggedProfile: PropTypes.shape(),
    transactionActions: PropTypes.shape(),
    minedTransactions: PropTypes.shape()

};

function mapStateToProps (state) {
    return {
        loggedProfile: state.profileState.get('loggedProfile'),
        loggedProfileData: state.profileState.get('profiles').find(prf =>
            prf.get('profile') === state.profileState.getIn(['loggedProfile', 'profile'])),
        drafts: state.draftState.get('drafts'),
        minedTransactions: state.transactionState.get('mined'),
        pendingActions: state.appState.get('pendingActions'),
    };
}

function mapDispatchToProps (dispatch) {
    return {
        draftActions: new DraftActions(dispatch),
        appActions: new AppActions(dispatch),
        transactionActions: new TransactionActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PublishEntryRunner);
