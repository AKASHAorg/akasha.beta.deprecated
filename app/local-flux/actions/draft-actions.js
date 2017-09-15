import { action } from './helpers';
import * as types from '../constants';

/**
 * Create a new draft in reducer only
 * Do not persist it in db because a user can discard it
 * by navigating away or switching to another draft
 */

export const draftCreate = data => action(types.DRAFT_CREATE, { data });
export const draftCreateSuccess = data => action(types.DRAFT_CREATE_SUCCESS, { data });
export const draftCreateError = data => action(types.DRAFT_CREATE_ERROR, { data });

/**
 * Get all drafts of an akashaId
 */

export const draftsGet = data => action(types.DRAFTS_GET, { data });
export const draftsGetSuccess = data => action(types.DRAFTS_GET_SUCCESS, { data });
export const draftsGetError = error => action(types.DRAFTS_GET_ERROR, { error });

/**
 * Get draft by id. Must perform a db search by provided id.
 * This action must be executed only if draftId is not 'new'
 */

export const draftGetById = data => action(types.DRAFT_GET_BY_ID, { data });
export const draftGetByIdSuccess = data => action(types.DRAFT_GET_BY_ID_SUCCESS, { data });
export const draftGetByIdError = error => action(types.DRAFT_GET_BY_ID_ERROR, { error });

/**
 * Update a draft in reducer only
 * Do not save it to db in this stage. We want to update the view as
 * fast as possible.
 */

export const draftUpdate = data => action(types.DRAFT_UPDATE, { data });
export const draftUpdateSuccess = data => action(types.DRAFT_UPDATE_SUCCESS, { data });
export const draftUpdateError = error => action(types.DRAFT_UPDATE_ERROR, { error });

/**
 * Autosave draft in db only. Do not update the data in reducer
 * because it may be outdated. This action is throttled!
 */

export const draftAutosave = data => action(types.DRAFT_AUTOSAVE, { data });
export const draftAutosaveSuccess = data => action(types.DRAFT_AUTOSAVE_SUCCESS, { data });
export const draftAutosaveError = error => action(types.DRAFT_AUTOSAVE_ERROR, { error });

/**
 * Delete draft in db and reducer. We must check if the draft is in database
 * to avoid errors.
 */

export const draftDelete = data => action(types.DRAFT_DELETE, { data });
export const draftDeleteSuccess = data => action(types.DRAFT_DELETE_SUCCESS, { data });
export const draftDeleteError = data => action(types.DRAFT_DELETE_ERROR, { data });

/**
 * This should be the first action in publishing process.
 * All other actions should be in entry-actions (?).
 */

export const draftPublish = ({ actionId, ...payload }) =>
    action(types.DRAFT_PUBLISH, { actionId, ...payload });

export const draftPublishSuccess = data => action(types.DRAFT_PUBLISH_SUCCESS, { data });
export const draftPublishError = error => action(types.DRAFT_PUBLISH_ERROR, { error });

/**
 * Get drafts count for an akashaId
 */

export const draftsGetCount = data => action(types.DRAFTS_GET_COUNT, { data });
export const draftsGetCountSuccess = data => action(types.DRAFTS_GET_COUNT_SUCCESS, { data });
export const draftsGetCountError = error => action(types.DRAFTS_GET_COUNT_ERROR, { error });



    // publishDraft = (payload, gas = 4000000) => {
    //     this.dispatch((dispatch, getState) => {
    //         const loggedProfile = getState().profileState.get('loggedProfile');
    //         const token = loggedProfile.get('token');
    //         const draft = payload.get('draft');
    //         const mentions = payload.get('mentions');
    //         const flagOn = { draftId: draft.get('id'), value: true };
    //         const flagOff = { draftId: draft.get('id'), value: false };
    //         const draftObj = draft.toJS();
    //         dispatch(draftActionCreators.publishDraft({ publishPending: flagOn }));
    //         this.entryService.publishEntry({
    //             draftObj,
    //             token,
    //             gas,
    //             onSuccess: (data) => {
    //                 this.transactionActions.listenForMinedTx();
    //                 this.transactionActions.addToQueue([{
    //                     tx: data.tx,
    //                     type: draftObj.entryId ? 'publishNewEntryVersion' : 'publishEntry',
    //                     draftId: draftObj.id,
    //                     entryId: draftObj.entryId,
    //                     mentions
    //                 }]);
    //                 this.appActions.showNotification({
    //                     id: draftObj.entryId ? 'publishingNewEntryVersion' : 'publishingEntry',
    //                     values: { title: draftObj.content.title },
    //                     duration: 3000
    //                 });
    //                 hashHistory.replace(`/${draft.get('akashaId')}/draft/${draft.get('id')}/publish-status`);
    //             },
    //             onError: error => dispatch(draftActionCreators.publishDraftError(error, {
    //                 publishPending: flagOff
    //             }))
    //         });
    //     });
    // };
    /**
     * This action should be placed in entryActions ?
     * Or it should be renamed to publishDraftSuccess ?
     */
    // publishEntrySuccess = (draftId, title) => {
    //     this.dispatch(draftActionCreators.publishDraftSuccess({
    //         publishPending: { draftId, value: false }
    //     }));
    //     this.appActions.showNotification({
    //         id: 'draftPublishedSuccessfully',
    //         values: { title }
    //     });
    //     this.deleteDraft(draftId);
    // };

    // publishNewEntryVersionSuccess = (draftId, title) => {
    //     this.dispatch(draftActionCreators.publishDraftSuccess({
    //         publishPending: { draftId, value: false }
    //     }));
    //     this.appActions.showNotification({
    //         id: 'newVersionPublishedSuccessfully',
    //         values: { title }
    //     });
    //     this.deleteDraft(draftId);
    // }

    // getDrafts = (akashaId) => {
    //     draftActionCreators.getDrafts({ fetchingDrafts: true });
    //     this.draftService.getAllDrafts(akashaId)
    //         .then(result => this.dispatch(draftActionCreators.getDraftsSuccess(result, {
    //             fetchingDrafts: false
    //         })))
    //         .catch(reason => this.dispatch(draftActionCreators.getDraftsError(reason, {
    //             fetchingDrafts: false
    //         })));
    // };

    // getDraftsCount = (akashaId) => {
    //     this.dispatch((dispatch, getState) => {
    //         const flags = getState().draftState.get('flags');
    //         if (!flags.get('fetchingDraftsCount') && !flags.get('draftsCountFetched')) {
    //             dispatch(draftActionCreators.getDraftsCount({
    //                 fetchingDraftsCount: true
    //             }));
    //             this.draftService.getDraftsCount({
    //                 akashaId,
    //                 onSuccess: result =>
    //                     dispatch(draftActionCreators.getDraftsCountSuccess(result, {
    //                         fetchingDraftsCount: false,
    //                         draftsCountFetched: true
    //                     })),
    //                 onError: reason => dispatch(draftActionCreators.getDraftsCountError(reason, {
    //                     fetchingDraftsCount: false,
    //                     draftsCountFetched: false
    //                 }))
    //             });
    //         }
    //     });
    // };

    // getDraftById = id =>
    //     this.draftService.getById({
    //         id,
    //         onSuccess: result => this.dispatch(draftActionCreators.getDraftByIdSuccess(result)),
    //         onError: error => this.dispatch(draftActionCreators.getDraftByIdError(error))
    //     });
// }

// export { DraftActions };
