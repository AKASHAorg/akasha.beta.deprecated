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
    return {
        type: types.UPDATE_DRAFT_ERROR,
        error
    };
}


// export function getDraftsSuccess (drafts) {
//     return {
//         type: types.GET_DRAFTS_SUCCESS,
//         drafts
//     };
// }

// export function getDraftsError (error) {
//     return {
//         type: types.GET_DRAFTS_ERROR,
//         error
//     };
// }

// export function getDraftsCountSuccess (count) {
//     return {
//         type: types.GET_DRAFTS_COUNT_SUCCESS,
//         count
//     };
// }

// export function getDraftsCountError (error) {
//     return {
//         type: types.GET_DRAFTS_COUNT_ERROR,
//         error
//     };
// }

// export function getDraftSuccess (draft) {
//     return {
//         type: types.GET_DRAFT_SUCCESS,
//         draft
//     };
// }

// export function getDraftError (error) {
//     return {
//         type: types.GET_DRAFT_ERROR,
//         error
//     };
// }
