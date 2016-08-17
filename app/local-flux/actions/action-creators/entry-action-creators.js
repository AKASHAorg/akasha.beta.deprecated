import * as types from '../../constants/EntryConstants';

export function createDraftSuccess (draft) {
    return {
        type: types.CREATE_DRAFT_SUCCESS,
        draft
    };
}

export function createDraftError (error) {
    return {
        type: types.CREATE_DRAFT_ERROR,
        error
    };
}

export function updateDraftError (error) {
    return {
        type: types.UPDATE_DRAFT_ERROR,
        error
    };
}

export function updateDraftSuccess (draft) {
    return {
        type: types.UPDATE_DRAFT_SUCCESS,
        draft
    };
}

export function startSavingDraft () {
    return { type: types.SAVE_DRAFT };
}

export function getDraftsSuccess (drafts) {
    return {
        type: types.GET_DRAFTS_SUCCESS,
        drafts
    };
}

export function getDraftsError (error) {
    return {
        type: types.GET_DRAFTS_ERROR,
        error
    };
}

export function getDraftsCountSuccess (count) {
    return {
        type: types.GET_DRAFTS_COUNT_SUCCESS,
        count
    };
}

export function getDraftsCountError (error) {
    return {
        type: types.GET_DRAFTS_COUNT_ERROR,
        error
    };
}

export function getEntriesCountSuccess (count) {
    return {
        type: types.GET_ENTRIES_COUNT_SUCCESS,
        count
    };
}

export function getEntriesCountError (error) {
    return {
        type: types.GET_ENTRIES_COUNT_ERROR,
        error
    };
}

export function getDraftSuccess (draft) {
    return {
        type: types.GET_DRAFT_SUCCESS,
        draft
    };
}

export function getDraftError (error) {
    return {
        type: types.GET_DRAFT_ERROR,
        error
    };
}
export function getTags () {
    return {
        type: types.GET_TAGS
    };
}
export function getTagsSuccess (tags) {
    return {
        type: types.GET_TAGS_SUCCESS,
        tags
    };
}

export function getTagsError (error) {
    return {
        type: types.GET_TAGS_ERROR,
        error
    };
}

export function checkTagExistenceSuccess (result) {
    return {
        type: types.CHECK_TAG_EXISTENCE_SUCCESS,
        result
    };
}

export function checkTagExistence () {
    return {
        type: types.CHECK_TAG_EXISTENCE
    };
}

export function checkTagExistenceError (error) {
    return {
        type: types.CHECK_TAG_EXISTENCE_ERROR,
        error
    };
}

export function createTag () {
    return {
        type: types.CREATE_TAG
    };
}

export function createTagSuccess (tag) {
    return {
        type: types.CREATE_TAG_SUCCESS,
        tag
    };
}

export function createTagError (error) {
    return {
        type: types.CREATE_TAG_ERROR,
        error
    };
}
