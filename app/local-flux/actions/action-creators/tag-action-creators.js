import * as types from '../../constants/TagConstants';

export function getPendingTags (flags) {
    return {
        type: types.GET_PENDING_TAGS,
        flags
    };
}

export function createPendingTagSuccess (tag) {
    return {
        type: types.CREATE_PENDING_TAG_SUCCESS,
        tag
    };
}

export function updatePendingTagSuccess (tag) {
    return {
        type: types.UPDATE_PENDING_TAG_SUCCESS,
        tag
    };
}

export function updatePendingTagError (error) {
    console.error(error, 'updatePendingTagError');
    return {
        type: types.UPDATE_PENDING_TAG_ERROR,
        error
    };
}

export function deletePendingTagSuccess (tag) {
    return {
        type: types.DELETE_PENDING_TAG_SUCCESS,
        tag
    };
}

export function deletePendingTagError (error) {
    console.error(error, 'delete pending tag error');
    return {
        type: types.DELETE_PENDING_TAG_ERROR,
        error
    };
}

export function createPendingTagError (error) {
    console.error(error, 'Create pending tag error');
    return {
        type: types.CREATE_PENDING_TAG_ERROR,
        error
    };
}

export function getPendingTagsSuccess (data, flags) {
    return {
        type: types.GET_PENDING_TAGS_SUCCESS,
        data,
        flags
    };
}

export function getPendingTagsError (error, flags) {
    console.error(error, 'getPendingTagsError');
    return {
        type: types.GET_PENDING_TAGS_ERROR,
        error,
        flags
    };
}

export function savePendingTagSuccess (data) {
    return {
        type: types.SAVE_PENDING_TAG_SUCCESS,
        data
    };
}

export function savePendingTagError (error) {
    return {
        type: types.SAVE_PENDING_TAG_ERROR,
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

export function registerTag () {
    return {
        type: types.CREATE_TAG
    };
}

export function registerTagSuccess (data) {
    return {
        type: types.CREATE_TAG_SUCCESS,
        data
    };
}

export function registerTagError (error) {
    return {
        type: types.CREATE_TAG_ERROR,
        error
    };
}

export function getSelectedTag (flags) {
    return {
        type: types.GET_SELECTED_TAG,
        flags
    };
}

export function getSelectedTagSuccess (data, flags) {
    return {
        type: types.GET_SELECTED_TAG_SUCCESS,
        data,
        flags
    };
}

export function getSelectedTagError (error, flags) {
    error.code = 'GSTE01';
    return {
        type: types.GET_SELECTED_TAG_ERROR,
        error,
        flags
    };
}

export function saveTag (flags) {
    return {
        type: types.SAVE_TAG,
        flags
    };
}

export function saveTagSuccess (data, flags) {
    return {
        type: types.SAVE_TAG_SUCCESS,
        data,
        flags
    };
}

export function saveTagError (error, flags) {
    error.code = 'STE01';
    return {
        type: types.SAVE_TAG_ERROR,
        error,
        flags
    };
}

export function tagIterator (flags) {
    return {
        type: types.TAG_ITERATOR,
        flags
    };
}

export function tagIteratorSuccess (data, flags) {
    return {
        type: types.TAG_ITERATOR_SUCCESS,
        data,
        flags
    };
}

export function tagIteratorError (error, flags) {
    error.code = 'TIE01';
    return {
        type: types.TAG_ITERATOR_ERROR,
        error,
        flags
    };
}

export function clearNewestTags () {
    return {
        type: types.CLEAR_NEWEST_TAGS
    };
}

export function clearSelectedTag () {
    return {
        type: types.CLEAR_SELECTED_TAG
    };
}

export function subscribeTag (flags) {
    return {
        type: types.SUBSCRIBE_TAG,
        flags
    };
}

export function subscribeTagSuccess (flags) {
    return {
        type: types.SUBSCRIBE_TAG_SUCCESS,
        flags
    };
}

export function subscribeTagError (error, flags) {
    return {
        type: types.SUBSCRIBE_TAG_ERROR,
        error,
        flags
    };
}

export function unsubscribeTag (flags) {
    return {
        type: types.UNSUBSCRIBE_TAG,
        flags
    };
}

export function unsubscribeTagSuccess (flags) {
    return {
        type: types.UNSUBSCRIBE_TAG_SUCCESS,
        flags
    };
}

export function unsubscribeTagError (error, flags) {
    return {
        type: types.UNSUBSCRIBE_TAG_ERROR,
        error,
        flags
    };
}
