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
