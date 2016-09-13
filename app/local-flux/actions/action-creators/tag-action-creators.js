import * as types from '../../constants/TagConstants';

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

export function registerTags () {
    return {
        type: types.CREATE_TAG
    };
}

export function registerTagsSuccess (tags) {
    return {
        type: types.CREATE_TAG_SUCCESS,
        tags
    };
}

export function registerTagsError (error) {
    return {
        type: types.CREATE_TAG_ERROR,
        error
    };
}
