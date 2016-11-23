import { tagActionCreators } from './action-creators';
import { TagService } from '../services';
import { AppActions, TransactionActions } from 'local-flux';

let tagActions = null;

class TagActions {
    constructor (dispatch) {
        if (!tagActions) {
            tagActions = this;
        }
        this.dispatch = dispatch;
        this.appActions = new AppActions(dispatch);
        this.transactionActions = new TransactionActions(dispatch);
        this.tagService = new TagService();
        return tagActions;
    }
    createPendingTag = (tagObj = {}) => {
        this.tagService.createPendingTag({
            tagObj,
            onSuccess: pendingTag =>
                this.dispatch(tagActionCreators.createPendingTagSuccess(pendingTag)),
            onError: error => this.dispatch(tagActionCreators.createPendingTagError(error))
        });
    }
    updatePendingTag = (tagObj) => {
        this.tagService.updatePendingTag({
            tagObj,
            onSuccess: updatedTag =>
                this.dispatch(tagActionCreators.updatePendingTagSuccess(updatedTag)),
            onError: error => this.dispatch(tagActionCreators.updatePendingTagError(error))
        });
    }
    deletePendingTag = (tagObj) => {
        this.tagService.deletePendingTag({
            tagObj,
            onSuccess: () => this.dispatch(tagActionCreators.deletePendingTagSuccess(tagObj)),
            onError: error => this.dispatch(tagActionCreators.deletePendingTagError(error))
        });
    }
    // get all pending tags
    getPendingTags = profile =>
        this.dispatch((dispatch, getState) => {
            const flags = getState().tagState.get('flags');
            if (!flags.get('fetchingPendingTags')) {
                dispatch(tagActionCreators.getPendingTags({
                    fetchingPendingTags: true
                }));
                this.tagService.getPendingTags({
                    profile,
                    onSuccess: data => dispatch(tagActionCreators.getPendingTagsSuccess(data, {
                        fetchingPendingTags: false
                    })),
                    onError: error => dispatch(tagActionCreators.getPendingTagsError(error, {
                        fetchingPendingTags: false
                    }))
                });
            }
        });

    getTags = (options) => {
        this.dispatch(tagActionCreators.getTags());
        this.tagService.getLocalTagsCount().then((tagsCount) => {
            const startingIndex = (options && options.fetchAll) ? 0 : tagsCount;
            this.tagService.getTags(startingIndex).then((data) => {
                if (!data) {
                    const error = new Error(data.error);
                    this.dispatch(tagActionCreators.getTagsError(error));
                }
                this.dispatch(tagActionCreators.getTagsSuccess(data.tags));
            });
        });
    };
    registerTag = (tagName, token, gas = 2000000) => {
        this.dispatch(tagActionCreators.registerTag(tagName));
        this.tagService.registerTag({
            tagName,
            token,
            gas,
            onSuccess: (data) => {
                this.dispatch(tagActionCreators.registerTagSuccess({ tag: tagName, tx: data.tx }));
                console.log('register tag success', data);
                // save to pending tags
                this.savePendingTag({ tag: tagName, tx: data.tx });
            },
            onError: error => this.dispatch(tagActionCreators.registerTagError(error))
        });
    };
    savePendingTag = tagObj =>
        this.tagService.updatePendingTag({
            tagObj,
            onSuccess: data => this.dispatch(tagActionCreators.updatePendingTagSuccess(data)),
            onError: error => this.dispatch(tagActionCreators.updatePendingTagError(error))
        });

    getSelectedTag = akashaId => {
        this.dispatch(tagActionCreators.getSelectedTag({ fetchingSelectedTag: true }))
        this.tagService.getSelectedTag({
            akashaId,
            onSuccess: data => this.dispatch(tagActionCreators.getSelectedTagSuccess(data, {
                fetchingSelectedTag: false
            })),
            onError: error => this.dispatch(tagActionCreators.getSelectedTagError(error, {
                fetchingSelectedTag: false
            }))
        });
    };

    saveTag = (tagName) =>
        this.dispatch((dispatch, getState) => {
            const akashaId = getState().profileState.getIn(['loggedProfile', 'akashaId']);
            this.dispatch(tagActionCreators.saveTag({ savingTag: true }));
            this.tagService.saveTag({
                akashaId,
                tagName,
                onSuccess: data =>
                    this.dispatch(tagActionCreators.saveTagSuccess(data, { savingTag: false })),
                onError: error =>
                    this.dispatch(tagActionCreators.saveTagError(error, { savingTag: false }))
            });
        });

    tagIterator = (start, limit) => {
        this.dispatch(tagActionCreators.tagIterator({ fetchingTags: true }));
        this.tagService.tagIterator({
            start,
            limit,
            onSuccess: data => this.dispatch(tagActionCreators.tagIteratorSuccess(data, {
                fetchingTags: false
            })),
            onError: error => this.dispatch(tagActionCreators.tagIteratorError(error, {
                fetchingTags: false
            }))
        });
    };

    subscribeTag = (tagName, gas) =>
        this.dispatch((dispatch, getState) => {
            const loggedProfile = getState().profileState.get('loggedProfile');
            const flagOn = { tagName, value: true };
            const flagOff = { tagName, value: true };
            dispatch(tagActionCreators.subscribeTag({ subscribePending: flagOn }));
            this.tagService.subscribeTag({
                token: loggedProfile.get('token'),
                tagName,
                gas,
                onSuccess: (data) => {
                    this.transactionActions.listenForMinedTx();
                    this.transactionActions.addToQueue([{
                        tx: data.tx,
                        type: 'subscribeTag',
                        tagName: data.tagName
                    }]);
                    this.appActions.showNotification({
                        id: 'subscribingTag',
                        values: { tagName: data.tagName }
                    });
                },
                onError: error =>
                    dispatch(tagActionCreators.subscribeTagError(error, {
                        subscribePending: flagOff
                    }))
            });
        });

    subscribeTagSuccess = (tagName) => {
        this.dispatch(tagActionCreators.subscribeTagSuccess({
            subscribePending: { tagName, value: false }
        }));
        this.appActions.showNotification({
            id: 'tagSubscribedSuccessfully',
            values: { tagName }
        });
    };

    unsubscribeTag = (tagName, gas) =>
        this.dispatch((dispatch, getState) => {
            const loggedProfile = getState().profileState.get('loggedProfile');
            const flagOn = { tagName, value: true };
            const flagOff = { tagName, value: true };
            dispatch(tagActionCreators.unsubscribeTag({ subscribePending: flagOn }));
            this.tagService.unsubscribeTag({
                token: loggedProfile.get('token'),
                tagName,
                gas,
                onSuccess: (data) => {
                    this.transactionActions.listenForMinedTx();
                    this.transactionActions.addToQueue([{
                        tx: data.tx,
                        type: 'unsubscribeTag',
                        tagName: data.tagName
                    }]);
                    this.appActions.showNotification({
                        id: 'unsubscribingTag',
                        values: { tagName: data.tagName }
                    });
                },
                onError: error =>
                    dispatch(tagActionCreators.unsubscribeTagError(error, {
                        subscribePending: flagOff
                    }))
            });
        });

    unsubscribeTagSuccess = (tagName) => {
        this.dispatch(tagActionCreators.unsubscribeTagSuccess({
            subscribePending: { tagName, value: false }
        }));
        this.appActions.showNotification({
            id: 'tagUnsubscribedSuccessfully',
            values: { tagName }
        });
    }

    addSubscribeTagAction = (tagName) => {
        this.appActions.addPendingAction({
            type: 'subscribeTag',
            payload: { tagName },
            titleId: 'subscribeTagTitle',
            messageId: 'subscribeTag',
            gas: 2000000,
            status: 'needConfirmation'
        });
    }

    addUnsubscribeTagAction = (tagName) => {
        this.appActions.addPendingAction({
            type: 'unsubscribeTag',
            payload: { tagName },
            titleId: 'unsubscribeTagTitle',
            messageId: 'unsubscribeTag',
            gas: 2000000,
            status: 'needConfirmation'
        });
    }

    clearNewestTags = () =>
        this.dispatch(tagActionCreators.clearNewestTags());

    clearSelectedTag = () =>
        this.dispatch(tagActionCreators.clearSelectedTag());
}
export { TagActions };
