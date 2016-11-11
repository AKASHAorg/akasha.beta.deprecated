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
        const { transactionActions, loggedProfile, draftActions } = this.props;
        transactionActions.getPendingTransactions();
        transactionActions.getMinedTransactions();
        draftActions.getPublishingDrafts(loggedProfile.get('profile'));
    }
    componentWillReceiveProps (nextProps) {
        const { drafts, appActions, loggedProfile, draftActions, transactionActions,
            minedTransactions } = nextProps;
        let publishableDrafts = [];
        if (drafts.size > 0) {
            publishableDrafts = drafts.filter(draft =>
                draft.status.publishing && draft.status.publishingConfirmed);
        }
        if (publishableDrafts.size > 0) {
            publishableDrafts.forEach((draft) => {
                const { status } = draft;
                if (status.currentAction === 'checkLogin' && status.publishing && status.publishingConfirmed) {
                    const tokenIsValid = this._verifyExpiration(loggedProfile.get('expiration'));
                    if (tokenIsValid) {
                        return this._registerDraft(draft, loggedProfile.get('token'));
                    }
                    return appActions.showAuthDialog();
                }
                if (status.currentAction === 'draftPublished' && draft.tx) {
                    return this._checkForTx(draft);
                }
                if (status.currentAction === 'listeningTx' &&
                        minedTransactions.findIndex(minedTx => minedTx.tx === draft.tx) !== -1) {
                    // delete draft and pendingTxs
                    draftActions.deleteDraft(draft.id);
                    transactionActions.deletePendingTx(draft.tx);
                }
            });
        }
    }
    _updateDraftStatus = (currentDraft, statusChanges) => {
        const { draftActions } = this.props;
        const newDraft = currentDraft.set('status',
            Object.assign({}, currentDraft.get('status'), statusChanges));
        draftActions.updateDraft(newDraft);
    }
    _checkForTx = (draft) => {
        const { transactionActions } = this.props;
        transactionActions.listenForMinedTx();
        transactionActions.addToQueue([{ tx: draft.tx }]);
        this._updateDraftStatus(draft, {
            currentAction: 'listeningTx'
        });
    };

    _verifyExpiration = expirationDate =>
        Date.parse(expirationDate) > Date.now();

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
        minedTransactions: state.transactionState.get('mined')
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
