import { draftActionCreators } from './action-creators';
import { DraftService, EntryService } from '../services';

let draftActions = null;

class DraftActions {
    constructor (dispatch) {
        if (draftActions) {
            return draftActions;
        }
        this.dispatch = dispatch;
        this.draftService = new DraftService();
        this.entryService = new EntryService();
        draftActions = this;
    }

    // Must return a promise and also to dispatch actions
    createDraftSync = (profile, draft) =>
        this.dispatch((dispatch, getState) => {
            const flags = getState().draftState.get('flags');
            if (!flags.get('savingDraft')) {
                dispatch(draftActionCreators.startSavingDraft({
                    savingDraft: true
                }));
                return this.draftService.saveDraft({ profile, ...draft }).then((result) => {
                    dispatch(draftActionCreators.createDraftSuccess(result, {
                        savingDraft: false
                    }));
                    return result;
                }).catch(reason => dispatch(draftActionCreators.createDraftError(reason, {
                    savingDraft: false
                })));
            }
            return Promise.resolve();
        });
    // must return a promise.
    updateDraft = changes =>
        this.dispatch((dispatch, getState) => {
            const flags = getState().draftState.get('flags');
            if (!flags.get('savingDraft')) {
                dispatch(draftActionCreators.startSavingDraft({
                    savingDraft: true
                }));
                return this.draftService.saveDraft(changes).then((savedDraft) => {
                    dispatch(draftActionCreators.updateDraftSuccess(savedDraft, {
                        savingDraft: false
                    }));
                    return savedDraft;
                }).catch(reason => dispatch(draftActionCreators.updateDraftError(reason, {
                    savingDraft: false
                })));
            }
            return Promise.resolve();
        });
    deleteDraft = (draftId) => {
        this.draftService.deleteDraft({
            draftId,
            onSuccess: deletedId =>
                this.dispatch(draftActionCreators.deleteDraftSuccess(deletedId)),
            onError: error => this.dispatch(draftActionCreators.deleteDraftError(error))
        });
    }
    updateDraftThrottled = (draft) => {
        this.dispatch(draftActionCreators.startSavingDraft());
        return this.throttledUpdateDraft(draft);
    };

    publishDraft = (draft, token, gas = 4000000) => {
        console.log('publishDraft action');
        this.entryService.publishEntry({
            draft,
            token,
            gas,
            onSuccess: (data) => {
                console.log('publish draft success', data);
                this.dispatch(draftActionCreators.publishDraftSuccess(data));
                const newDraft = Object.assign({}, draft, data);
                newDraft.status.currentAction = 'draftPublished';
                console.log(newDraft, 'newly updated draft');
                this.updateDraft(newDraft);
            },
            onError: (error) => {
                console.error(error, 'publish draft error');
                this.dispatch(draftActionCreators.publishDraftError(error));
            }
        });
    };

    getDrafts = profile =>
        this.draftService.getAllDrafts(profile).then(result =>
            this.dispatch(draftActionCreators.getDraftsSuccess(result))
        ).catch(reason => this.dispatch(draftActionCreators.getDraftsError(reason)));

    getDraftsCount = (profile) => {
        this.dispatch((dispatch, getState) => {
            const flags = getState().draftState.get('flags');
            if (!flags.get('fetchingDraftsCount') && !flags.get('draftsCountFetched')) {
                dispatch(draftActionCreators.getDraftsCount({
                    fetchingDraftsCount: true
                }));
                this.draftService.getDraftsCount({
                    profile,
                    onSuccess: result =>
                        dispatch(draftActionCreators.getDraftsCountSuccess(result, {
                            fetchingDraftsCount: false,
                            draftsCountFetched: true
                        })),
                    onError: reason => dispatch(draftActionCreators.getDraftsCountError(reason, {
                        fetchingDraftsCount: false,
                        draftsCountFetched: false
                    }))
                });
            }
        });
    };

    getDraftById = id =>
        this.draftService.getById({
            id,
            onSuccess: result => this.dispatch(draftActionCreators.getDraftByIdSuccess(result)),
            onError: error => this.dispatch(draftActionCreators.getDraftByIdError(error))
        });

    getPublishingDrafts = (profile) => {
        this.dispatch((dispatch, getState) => {
            const flags = getState().draftState.get('flags');
            if (!flags.get('fetchingPublishingDrafts') && !flags.get('publishingDraftsFetched')) {
                dispatch(draftActionCreators.getPublishingDrafts({
                    fetchingPublishingDrafts: true,
                }));
                this.draftService.getPublishingDrafts({
                    profile,
                    onSuccess: data =>
                        dispatch(draftActionCreators.getPublishingDraftsSuccess(data, {
                            fetchingPublishingDrafts: false,
                            publishingDraftsFetched: true
                        })),
                    onError: error => dispatch(draftActionCreators.getPublishingDraftsError(error, {
                        fetchingPublishingDrafts: false,
                        publishingDraftsFetched: false
                    }))
                });
            }
        });
    };
}

export { DraftActions };
