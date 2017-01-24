import * as types from '../../constants/CommentsConstants';

export function getEntryComments (flags) {
    return {
        type: types.GET_ENTRY_COMMENTS,
        flags
    };
}

export function getEntryCommentsSuccess (comments, options, flags) {
    return {
        type: types.GET_ENTRY_COMMENTS_SUCCESS,
        comments,
        options,
        flags
    };
}

export function getEntryCommentsError (error, flags) {
    return {
        type: types.GET_ENTRY_COMMENTS_ERROR,
        error,
        flags
    };
}

export function fetchNewCommentsSuccess (comment) {
    return {
        type: types.FETCH_NEW_COMMENTS_SUCCESS,
        comment
    };
}

export function clearNewCommentsIds () {
    return {
        type: types.CLEAR_NEW_COMMENTS_IDS_SUCCESS
    };
}

export function getCommentsCountSuccess (data) {
    return {
        type: types.GET_COMMENTS_COUNT_SUCCESS,
        data
    };
}

export function getCommentsCountError (error) {
    return {
        type: types.GET_COMMENTS_COUNT_ERROR,
        error
    };
}

export function publishComment () {
    return {
        type: types.PUBLISH_COMMENT
    };
}

export function publishCommentSuccess (data) {
    return {
        type: types.PUBLISH_COMMENT_SUCCESS,
        data
    };
}

export function publishCommentOptimistic (comment) {
    return {
        type: types.PUBLISH_COMMENT_OPTIMISTIC,
        comment
    };
}

export function publishCommentError (error) {
    return {
        type: types.PUBLISH_COMMENT_ERROR,
        error
    };
}

export function unloadComments (entryId, commentId) {
    return {
        type: types.UNLOAD_COMMENTS,
        entryId,
        commentId
    };
}
