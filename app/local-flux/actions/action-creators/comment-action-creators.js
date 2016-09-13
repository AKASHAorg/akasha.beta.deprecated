import * as types from '../../constants/CommentConstants';

export function getCommentsByEntrySuccess (comments) {
    return {
        type: types.GET_COMMENTS_BY_ENTRY_SUCCESS,
        comments
    };
}

export function getCommentsByEntryError (error) {
    return {
        type: types.GET_COMMENTS_BY_ENTRY_ERROR,
        error
    };
}
