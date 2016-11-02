import * as types from '../../constants/DraftConstants';

export function startSavingDraft (flags) {
    return {
        type: types.SAVE_DRAFT,
        flags
    };
}
export function createDraftSuccess (draft, flags) {
    return {
        type: types.CREATE_DRAFT_SUCCESS,
        draft,
        flags
    };
}

export function createDraftError (error, flags) {
    error.code = 'CDE';
    console.error('createDraftError', error);
    return {
        type: types.CREATE_DRAFT_ERROR,
        error,
        flags
    };
}

export function updateDraftSuccess (draft, flags) {
    return {
        type: types.UPDATE_DRAFT_SUCCESS,
        draft,
        flags
    };
}

export function updateDraftError (error, flags) {
    error.code = 'UDE';
    console.error(error, 'updateDraftError');
    return {
        type: types.UPDATE_DRAFT_ERROR,
        error,
        flags
    };
}


export function getDraftsSuccess (drafts, flags) {
    return {
        type: types.GET_DRAFTS_SUCCESS,
        drafts,
        flags
    };
}

export function getDraftsError (error, flags) {
    error.code = 'GDE';
    console.error('getDraftsError', error);
    return {
        type: types.GET_DRAFTS_ERROR,
        error,
        flags
    };
}

export function getDraftsCount (flags) {
    return {
        type: types.GET_DRAFTS_COUNT,
        flags
    };
}

export function getDraftsCountSuccess (count, flags) {
    return {
        type: types.GET_DRAFTS_COUNT_SUCCESS,
        count,
        flags
    };
}

export function getDraftsCountError (error, flags) {
    return {
        type: types.GET_DRAFTS_COUNT_ERROR,
        error,
        flags
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

export function getPublishingDrafts (flags) {
    return {
        type: types.GET_PUBLISHING_DRAFTS,
        flags
    };
}

export function getPublishingDraftsSuccess (drafts, flags) {
    return {
        type: types.GET_PUBLISHING_DRAFTS_SUCCESS,
        drafts,
        flags
    };
}

export function getPublishingDraftsError (error, flags) {
    error.code = 'GPDE';
    console.error('getPublishingDraftsError', error);
    return {
        type: types.GET_PUBLISHING_DRAFTS_ERROR,
        error,
        flags
    };
}
