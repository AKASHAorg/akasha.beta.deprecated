import * as types from '../../constants/DraftConstants';

export function startSavingDraft () {
    return { type: types.SAVE_DRAFT };
}
export function createDraftSuccess (draft) {
    return {
        type: types.CREATE_DRAFT_SUCCESS,
        draft
    };
}

export function createDraftError (error) {
    error.code = 'CDE';
    console.error('createDraftError', error);
    return {
        type: types.CREATE_DRAFT_ERROR,
        error
    };
}

export function updateDraftSuccess (draft) {
    return {
        type: types.UPDATE_DRAFT_SUCCESS,
        draft
    };
}

export function updateDraftError (error) {
    error.code = 'UDE';
    console.error(error, 'updateDraftError');
    return {
        type: types.UPDATE_DRAFT_ERROR,
        error
    };
}


export function getDraftsSuccess (drafts) {
    return {
        type: types.GET_DRAFTS_SUCCESS,
        drafts
    };
}

export function getDraftsError (error) {
    error.code = 'GDE';
    console.error('getDraftsError', error);
    return {
        type: types.GET_DRAFTS_ERROR,
        error
    };
}

export function getDraftsCount () {
    return {
        type: types.GET_DRAFTS_COUNT
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

export function getDraftByIdSuccess (draft) {
    return {
        type: types.GET_DRAFT_BY_ID_SUCCESS,
        draft
    };
}

export function getDraftByIdError (error) {
    error.code = 'GDBIE';
    console.error('getDraftByIdError', error);
    return {
        type: types.GET_DRAFT_BY_ID_ERROR,
        error
    };
}

export function getPublishingDraftsSuccess (drafts) {
    return {
        type: types.GET_PUBLISHING_DRAFTS_SUCCESS,
        drafts
    };
}

export function getPublishingDraftsError (error) {
    return {
        type: types.GET_PUBLISHING_DRAFTS_ERROR,
        error
    };
}
