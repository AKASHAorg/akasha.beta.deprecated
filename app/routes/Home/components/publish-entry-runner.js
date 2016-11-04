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
        const { tagActions, transactionActions, loggedProfile, draftActions } = this.props;
        tagActions.getPendingTags();
        transactionActions.getPendingTransactions();
        draftActions.getPublishingDrafts(loggedProfile.get('profile'));
    }
    componentWillReceiveProps (nextProps) {
        const { tagActions, appActions } = this.props;
        const { drafts, params, loggedProfile, loggedProfileData } = nextProps;
        const publishableDrafts = drafts.filter(draft =>
            draft.status.publishing && draft.status.publishingConfirmed);
        if (publishableDrafts.size > 0) {
            return publishableDrafts.forEach((draft) => {
                const { currentAction, started } = draft.get('status');
                    console.log(draft.get('status').currentAction, 'currentAction');
                // this._updateDraftStatus(draft, {
                //     currentAction: 'registeringDraft'
                // });

                if (currentAction === 'listenDraftTx') {
                    return this._listenDraftTx(draft);
                }
                /**
                 * `draftPublished` means that we have sent publishing request to main and we are waiting
                 *  to receive tx
                 *  this status will check if tx exists and will forward to `listenDraftTx` action
                 */
                if (currentAction === 'draftPublished') {
                    return this._checkForTx();
                }
                /**
                 * draft.status.started means that the user is newly logged in and it should resume
                 * publishing manually to prevent accidental double publishing.
                 * if currentAction is `draftPublished` or `listenDraftTx` there is no need to resume
                 */
                if (started) {
                    /**
                     * Find any unexistent tags and publish
                     * add published tags to pending tags
                     */
                    if (currentAction === 'publishingTags') {
                        return this._publishDraftTags(draft);
                    }
                    /**
                     * Find any pending tags and listen for txs
                     * remove pending tag when mined event arrived
                     */
                    if (currentAction === 'listenTagsTx') {
                        return this._listenPendingTagsTx();
                    }
                    /**
                     * Resume draft publishing
                     */
                    return this._resumeDraftPublishing(draft);
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
    _checkForTx = () => {
        console.log('checking for tx');
    };
    _findPublishableTags = (tags) => {
        const tagService = new TagService();
        let tagsPromise = Promise.resolve();
        tags.forEach((tag) => {
            tagsPromise = tagsPromise.then(prevData =>
                new Promise((resolve, reject) => {
                    tagService.checkExistingTags(tag, (ev, { data, error }) => {
                        if (error) {
                            return reject(error);
                        }
                        if (prevData) {
                            return resolve(prevData.concat([{ tag, exists: data.exists }]));
                        }
                        return resolve([{ tag, exists: data.exists }]);
                    });
                })
            );
        });
        return tagsPromise.then(results =>
            results.filter(res => res.exists === false)
        );
    }
    // only related to draft publishing
    // should check if previous steps are completed
    _resumeDraftPublishing = (draft) => {
        const { draftActions, transactionActions, pendingTags, loggedProfile,
            pendingTransactions } = this.props;
        const draftTags = draft.get('tags');
        // exclude tags already in pending state
        const tagsToRegister = draftTags.filter(tag =>
            pendingTags.findIndex(tagObj => tagObj.tag === tag) === -1);
        if (tagsToRegister.length === 0) {
            // no tags to publish
            return this._registerDraft(draft);
        }
        // check on blockchain and register tag
        this._findPublishableTags(tagsToRegister).then((notRegistered) => {
            console.log(notRegistered, 'notReg')
            if (notRegistered.length > 0) {
                return this._updateDraftStatus(draft, {
                    currentAction: 'publishingTags'
                });
            }
        });
        this._registerDraft(draft);
    }

    _verifyExpiration = expirationDate =>
        Date.parse(expirationDate) > Date.now();

    _listenPendingTagsTx = () => {
        const { pendingTags } = this.props;
        console.log(pendingTags);
    }

    _publishDraftTags = (draft) => {
        console.log('publishDraftTags', draft);
        const { tagActions, appActions, tagState, loggedProfile } = this.props;
        this._findPublishableTags(draft.get('tags')).then(tags => {
            if (tags.length === 0) {
                return this._updateDraftStatus(draft, {
                    currentAction: 'registeringDraft'
                });
            }
            tags.forEach((tagObj) => {
                if (!this._verifyExpiration(loggedProfile.get('expiration'))) {
                    return appActions.showNotification({
                        type: 'alertLoginRequired',
                        message: `You must confirm your password to publish tag "${tagObj.tag}"`
                    });
                }
                console.log('publishing allowed!');
                tagActions.registerTag(tagObj.tag, loggedProfile.get('token'));
            });
            this.updateDraftStatus(draft, {
                currentAction: 'listenTagsTx',
            });
        });
    }

    _registerDraft = (draft) => {
        const { draftActions, loggedProfile, appActions } = this.props;
        // this._updateDraftStatus(draft, {
        //     currentAction: 'registeringDraft'
        // });
        const loginValid = this._verifyExpiration(loggedProfile.get('expiration'));
        if (!loginValid) {
            return appActions.showNotification({
                type: 'alertLoginRequired',
                message: `Please confirm  your password`
            });
        }
        draftActions.publishDraft(draft, loggedProfile.get('token'));
        this._updateDraftStatus(draft, {
            currentAction: 'draftPublished'
        });
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
