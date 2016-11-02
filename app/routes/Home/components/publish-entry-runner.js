import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { ProfileActions, DraftActions, AppActions, TagActions, TransactionActions } from 'local-flux';
import { TagService } from 'local-flux/services';
/**
 * This component will publish entries in parallel
 * main logic of entry publishing steps will be here
 * @TODO: Create some kind of queue and a task runner to be used for profile creation too
 *
 */
class PublishEntryRunner extends Component {
    componentWillMount () {
        const { tagActions, transactionActions } = this.props;
        tagActions.getPendingTags();
        transactionActions.getPendingTransactions();
    }
    componentWillReceiveProps (nextProps) {
        const { tagActions } = this.props;
        const { drafts, params, loggedProfile, loggedProfileData } = nextProps;
        const publishableDrafts = drafts.filter(draft =>
            draft.status.publishing && draft.status.publishingConfirmed);
        if (publishableDrafts.size > 0) {
            // show a message in a snackbar informing that publishing is in progress
            publishableDrafts.forEach((draft) => {
                if (draft.get('status').currentAction === 'publishingTags') {
                    this._publishDraftTags(draft);
                }
                this._resumeDraftPublishing(draft);
            });
        }
    }
    _updateDraftStatus = (currentDraft, statusChanges) => {
        const { draftActions } = this.props;
        const newDraft = currentDraft.merge({
            status: Object.assign({}, currentDraft.get('status'), statusChanges)
        });
        draftActions.updateDraft(newDraft);
    }
    _findPublishableTags = (tags, callbackFn) => {
        const tagService = new TagService();
        let itProc = 0;
        const nonExistent = [];
        tags.forEach((tag, key, arr) => {
            const cb = (ev, {data, error}) => {
                console.log('checking', tag);
                itProc += 1;
                if(!data.exists) {
                    nonExistent.push(tag);
                }
                if(itProc === arr.length) {
                    callbackFn(nonExistent)
                }
            }
            tagService.checkExistingTags(tag, cb);
        })
    }
    _resumeDraftPublishing = (draft) => {

        const { draftActions, transactionActions, pendingTags, loggedProfile,
            pendingTransactions } = this.props;
        const draftTags = draft.get('tags');
        // exclude tags already in pending state
        const tagsToRegister = draftTags.filter(tag =>
            pendingTags.findIndex(tagObj => tagObj.tag === tag) === -1);
        console.log(tagsToRegister, 'remaining tags');
        if (tagsToRegister.length === 0) {
            // no tags to publish
            return this._registerDraft(draft);
        }
        // check on blockchain and register tag
        this._findPublishableTags(tagsToRegister, (notRegisteredTags) => {
            console.log(notRegisteredTags, 'notRegisteredTags');
        });
        const notListeningPendingTags = pendingTags.filter(tagObj =>
            pendingTransactions.findIndex(tx => tx === tagObj.tx) === -1);

            console.log(notListeningPendingTags, 'notListeningPendingTags');

        if (notListeningPendingTags.size > 0) {
            notListeningPendingTags.forEach((tagObj) => {
                transactionActions.listenForMinedTx();
                transactionActions.addToQueue([{ tx: tagObj.tx }]);
            });
        } else {
            this._registerDraft(draft);
        }
    }
    _verifyExpiration = expirationDate =>
        Date.parse(expirationDate) > Date.now();
    _publishDraftTags = (draft) => {

    }
    _registerDraft = (draft) => {
        const { draftActions, loggedProfile } = this.props;
        this._updateDraftStatus(draft, {
            currentAction: 'registeringDraft'
        });
        const loginValid = this._verifyExpiration(loggedProfile.get('expiration'));
        console.log('ready to register draft');
    }
    _registerTag = (tag) => {
        const { tagActions, appActions, loggedProfile } = this.props;
        const loginValid = this._verifyExpiration(loggedProfile.get('expiration'));
        if (loginValid) {
            console.log('registering tag', tag);
            tagActions.registerTag(tag, loggedProfile.get('token'));
            return;
        }
        console.log('Action Required to continue!! Please Login again!!');
        return;
    }
    render () {
        return null;
    }
}

PublishEntryRunner.propTypes = {
    drafts: PropTypes.shape(),
    params: PropTypes.shape(),
    draftActions: PropTypes.shape(),
    appActions: PropTypes.shape(),
    pendingTags: PropTypes.shape(),
    loggedProfile: PropTypes.shape(),
    pendingTransactions: PropTypes.shape(),
};

function mapStateToProps (state) {
    return {
        loggedProfile: state.profileState.get('loggedProfile'),
        loggedProfileData: state.profileState.get('profiles').find(prf =>
            prf.get('profile') === state.profileState.getIn(['loggedProfile', 'profile'])),
        drafts: state.draftState.get('drafts'),
        pendingTags: state.tagState.get('pendingTags'),
        pendingTransactions: state.transactionState.get('pending')
    };
}

function mapDispatchToProps (dispatch) {
    return {
        profileActions: new ProfileActions(dispatch),
        draftActions: new DraftActions(dispatch),
        appActions: new AppActions(dispatch),
        tagActions: new TagActions(dispatch),
        transactionActions: new TransactionActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PublishEntryRunner);
