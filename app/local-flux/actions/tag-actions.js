import { AppActions, TransactionActions } from './';
import { tagActionCreators } from './action-creators';
import { TagService } from '../services';
import * as types from '../constants';
import { action } from './helpers';

let tagActions = null;

class TagActions {
    constructor (dispatch) { // eslint-disable-line consistent-return
        if (tagActions) {
            return tagActions;
        }
        this.dispatch = dispatch;
        this.appActions = new AppActions(dispatch);
        this.transactionActions = new TransactionActions(dispatch);
        this.tagService = new TagService();
        tagActions = this;
    }
    addRegisterTagAction = (tagName) => {
        this.appActions.addPendingAction({
            type: 'registerTag',
            payload: { tagName },
            titleId: 'registerTagTitle',
            messageId: 'registerTag',
            gas: 2000000,
            status: 'checkAuth'
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
    registerTag = (tagName, gas = 2000000) => {
        this.dispatch((dispatch, getState) => {
            const loggedProfile = getState().profileState.get('loggedProfile');
            const token = loggedProfile.get('token');
            const flagOn = { tagName, value: true };
            const flagOff = { tagName, value: false };
            dispatch(tagActionCreators.registerTag({ registerPending: flagOn }));
            this.tagService.registerTag({
                tagName,
                token,
                gas,
                onSuccess: (data) => {
                    this.transactionActions.listenForMinedTx();
                    this.transactionActions.addToQueue([{
                        tx: data.tx,
                        type: 'registerTag',
                        tagName: data.tag
                    }]);
                    this.appActions.showNotification({
                        id: 'registeringTag',
                        values: { tagName: data.tag },
                        duration: 3000
                    });
                },
                onError: error => dispatch(tagActionCreators.registerTagError(error, {
                    registerPending: flagOff
                }))
            });
        });
    };
    registerTagSuccess = (tagName) => {
        this.dispatch(tagActionCreators.registerTagSuccess({
            registerPending: { tagName, value: false }
        }));
        this.appActions.showNotification({
            id: 'tagRegisteredSuccessfully',
            values: { tagName }
        });
    };
    savePendingTag = tagObj =>
        this.tagService.updatePendingTag({
            tagObj,
            onSuccess: data => this.dispatch(tagActionCreators.updatePendingTagSuccess(data)),
            onError: error => this.dispatch(tagActionCreators.updatePendingTagError(error))
        });

    getSelectedTag = (akashaId) => {
        this.dispatch(tagActionCreators.getSelectedTag({ fetchingSelectedTag: true }));
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

    saveTag = tagName =>
        this.dispatch((dispatch, getState) => {
            const akashaId = getState().profileState.getIn(['loggedProfile', 'akashaId']);
            this.dispatch(tagActionCreators.saveTag(tagName, { savingTag: true }));
            this.tagService.saveTag({
                akashaId,
                tagName,
                onSuccess: data =>
                    this.dispatch(tagActionCreators.saveTagSuccess({ savingTag: false })),
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
                        values: { tagName: data.tagName },
                        duration: 3000
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
                        values: { tagName: data.tagName },
                        duration: 3000
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
            status: 'checkAuth'
        });
    }

    addUnsubscribeTagAction = (tagName) => {
        this.appActions.addPendingAction({
            type: 'unsubscribeTag',
            payload: { tagName },
            titleId: 'unsubscribeTagTitle',
            messageId: 'unsubscribeTag',
            gas: 2000000,
            status: 'checkAuth'
        });
    }

    clearNewestTags = () =>
        this.dispatch(tagActionCreators.clearNewestTags());
}
export { TagActions };

export const tagGetMarginsError = (error) => {
    error.code = 'TGLE01';
    return action(types.TAG_GET_MARGINS_ERROR, { error });
};

export const tagGetMarginsSuccess = data => action(types.TAG_GET_MARGINS_SUCCESS, { data });
export const tagGetSuggestions = tag => { console.log('tag get suggestions'); return action(types.TAG_GET_SUGGESTIONS, { tag }); };

export const tagGetSuggestionsError = (error) => {
    error.code = 'TGSE01';
    return action(types.TAG_GET_SUGGESTIONS_ERROR, { error });
};

export const tagGetSuggestionsSuccess = data =>
    action(types.TAG_GET_SUGGESTIONS_SUCCESS, { data });
export const tagIterator = () => action(types.TAG_ITERATOR);

export const tagIteratorError = (error) => {
    error.code = 'TIE01';
    return action(types.TAG_ITERATOR_ERROR, { error });
};

export const tagSave = data => action(types.TAG_SAVE, { data });

export const tagSaveError = (error) => {
    error.code = 'TSE01';
    return action(types.TAG_SAVE_ERROR, { error });
};

export const tagSaveSuccess = data => action(types.TAG_SAVE_SUCCESS, { data });
