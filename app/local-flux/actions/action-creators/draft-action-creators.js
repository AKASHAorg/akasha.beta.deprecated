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

export function deleteDraftSuccess (draftId) {
    return {
        type: types.DELETE_DRAFT_SUCCESS,
        draftId
    };
}

export function deleteDraftError (error) {
    error.code = 'DDE';
    console.error(error);
    return {
        type: types.DELETE_DRAFT_ERROR,
        error
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
    error.code = 'GDSE';
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
    error.code = 'GDCE';
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
    error.code = 'GDE';
    console.error(error);
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
    return {
        type: types.GET_DRAFT_BY_ID_ERROR,
        error
    };
}

export function publishDraftSuccess (data) {
    return {
        type: types.PUBLISH_DRAFT_SUCCESS,
        data
    };
}

export function publishDraftError (error) {
    return {
        type: types.PUBLISH_DRAFT_ERROR,
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

export function startPublishingDraft (draftId, flags) {
    return {
        type: types.START_PUBLISHING_DRAFT,
        draftId,
        flags
    };
}

export function pausePublishingDraft (draftId, flags) {
    return {
        type: types.PAUSE_PUBLISHING_DRAFT,
        draftId,
        flags
    };
}

export function getPublishingDraftsError (error, flags) {
    error.code = 'GPDE';
    return {
        type: types.GET_PUBLISHING_DRAFTS_ERROR,
        error,
        flags
    };
}
