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
    console.error(error, 'updatePendingTagError')
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
