import { AppActions, TransactionActions } from 'local-flux';
import { draftActionCreators } from './action-creators';
import { DraftService, EntryService } from '../services';

let draftActions = null;

class DraftActions {
    constructor (dispatch) { // eslint-disable-line consistent-return
        if (draftActions) {
            return draftActions;
        }
        this.dispatch = dispatch;
        this.draftService = new DraftService();
        this.entryService = new EntryService();
        this.transactionActions = new TransactionActions(dispatch);
        this.appActions = new AppActions(dispatch);
        draftActions = this;
    }

    // Must return a promise and also to dispatch actions
    createDraft = (profile, draft) =>
        this.dispatch((dispatch, getState) => {
            const flags = getState().draftState.get('flags');
            if (!flags.get('savingDraft')) {
                dispatch(draftActionCreators.startSavingDraft({
                    savingDraft: true
                }));
                return this.draftService.createOrUpdate({ profile, ...draft }).then((result) => {
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
                return this.draftService.createOrUpdate(changes).then((savedDraft) => {
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

    publishDraft = (draft, gas = 4000000) => {
        this.dispatch((dispatch, getState) => {
            const loggedProfile = getState().profileState.get('loggedProfile');
            const token = loggedProfile.get('token');
            const flagOn = { draftId: draft.get('id'), value: true };
            const flagOff = { draftId: draft.get('id'), value: false };
            dispatch(draftActionCreators.publishDraft({ publishPending: flagOn }));
            this.entryService.publishEntry({
                draft: draft.toJS(),
                token,
                gas,
                onSuccess: (data) => {
                    this.transactionActions.listenForMinedTx();
                    this.transactionActions.addToQueue([{
                        tx: data.tx,
                        type: 'publishEntry',
                        draftId: draft.get('id')
                    }]);
                    this.appActions.showNotification({
                        id: 'publishingEntry',
                        values: { title: draft.get('title') }
                    });
                },
                onError: error => dispatch(draftActionCreators.publishDraftError(error, {
                    publishPending: flagOff
                }))
            });
        });
    };
    /**
     * This action should be placed in entryActions ?
     * Or it should be renamed to publishDraftSuccess ?
     */
    publishEntrySuccess = (draftId, title) => {
        this.dispatch(draftActionCreators.publishDraftSuccess({
            publishPending: { draftId, value: false }
        }));
        this.appActions.showNotification({
            id: 'draftPublishedSuccessfully',
            values: { title }
        });
        this.deleteDraft(draftId);
    }
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

    clearDraftState = () => this.dispatch(draftActionCreators.clearDraftState());
}

export { DraftActions };
