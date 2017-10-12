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
 * Get all drafts of an ethAddress
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
export const draftAutosaveError = (error, draftId, draftTitle) => {
    error.code = 'DAE01';
    error.messageId = 'draftAutosave';
    error.values = { draftTitle };
    return action(types.DRAFT_AUTOSAVE_ERROR, { error, draftId });
};

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
export const draftPublishError = (error, draftId) => {
    error.code = 'DPE01';
    error.messageId = 'draftPublish';
    return action(types.DRAFT_PUBLISH_ERROR, { error, draftId });
};

/**
 * Publish an update of an entry to chain.
 * Not to be confused with draftUpdate!
 */
export const draftPublishUpdate = ({ actionId, ...payload }) =>
    action(types.DRAFT_PUBLISH_UPDATE, { actionId, ...payload });
export const draftPublishUpdateError = error => action(types.DRAFT_PUBLISH_UPDATE_ERROR, { error });
export const draftPublishUpdateSuccess = data => action(types.DRAFT_PUBLISH_UPDATE_SUCCESS, { data });
/**
 * Revert draft content to another version
 */
export const draftRevertToVersion = data => action(types.DRAFT_REVERT_TO_VERSION, { data });
export const draftRevertToVersionError = error => action(types.DRAFT_REVERT_TO_VERSION_ERROR, { error });
export const draftRevertToVersionSuccess = data => action(types.DRAFT_REVERT_TO_VERSION_SUCCESS, { data });

/**
 * Get drafts count for an ethAddress
 */
export const draftsGetCount = data => action(types.DRAFTS_GET_COUNT, { data });
export const draftsGetCountSuccess = data => action(types.DRAFTS_GET_COUNT_SUCCESS, { data });
export const draftsGetCountError = error => action(types.DRAFTS_GET_COUNT_ERROR, { error });

/**
 * Get entries as drafts
 */
export const entriesGetAsDraftsSuccess = data => action(types.ENTRIES_GET_AS_DRAFTS_SUCCESS, { data });
export const entriesGetAsDraftsError = (error) => {
    error.code = 'EGADE01';
    error.messageId = 'entriesGetAsDrafts';
    return action(types.ENTRIES_GET_AS_DRAFTS_ERROR, { error });
};

export const entryResolveIpfsHashAsDraftsSuccess = data =>
    action(types.ENTRY_RESOLVE_IPFS_HASH_AS_DRAFTS_SUCCESS, { data });
export const entryResolveIpfsHashAsDraftsError = error =>
    action(types.ENTRY_RESOLVE_IPFS_HASH_AS_DRAFTS_ERROR, { error });

