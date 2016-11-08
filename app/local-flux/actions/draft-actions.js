import { draftActionCreators } from './action-creators';
import { DraftService } from '../services';

let draftActions = null;

class DraftActions {
    constructor (dispatch) {
        if (!draftActions) {
            draftActions = this;
        }
        this.dispatch = dispatch;
        this.draftService = new DraftService();
        return draftActions;
    }
    resumeDraftPublishing = (draft) => {
        /**
         * Steps:
         * 1. Verify logged profile
         * 2. Verify balance
         * 3. Verify tag existence
         * 4. Publish tags
         * 5. Listen mined tx for tags
         * 6. Publish entry
         * 7. Listen mined tx for entry
         */
        console.info('resuming draft publishing', draft);
    };

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

    updateDraftThrottled = (draft) => {
        this.dispatch(draftActionCreators.startSavingDraft());
        return this.throttledUpdateDraft(draft);
    };

    publishDraft = (entry, profile) => {
        this.draftService.publishEntry(entry, profile).then(response =>
            this.dispatch(draftActionCreators.publishEntrySuccess, response.data)
        ).catch((reason) => {
            console.error(reason, reason.message);
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
