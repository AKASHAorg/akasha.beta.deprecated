import * as types from '../constants';
import { action } from './helpers';

export const tagCreate = data => action(types.TAG_CREATE, { data });
export const tagCreateError = error => action(types.TAG_CREATE_ERROR, { error });
export const tagCreateSuccess = data => action(types.TAG_CREATE_SUCCESS, { data });

export const tagCanCreate = data => action(types.TAG_CAN_CREATE, { data });
export const tagCanCreateSuccess = data => action(types.TAG_CAN_CREATE_SUCCESS, { data });
export const tagCanCreateError = data => action(types.TAG_CAN_CREATE_ERROR, { data });

export const tagExists = data => action(types.TAG_EXISTS, { data });
export const tagExistsError = (error, request) => {
    error.code = 'TEE01';
    error.messageId = 'tagExists';
    return action(types.TAG_EXISTS_ERROR, { error, request });
};
export const tagExistsSuccess = data => action(types.TAG_EXISTS_SUCCESS, { data });

export const tagGetEntriesCount = tags => action(types.TAG_GET_ENTRIES_COUNT, { tags });

export const tagGetEntriesCountError = (error) => {
    error.code = 'TGECE01';
    error.messageId = 'tagGetEntriesCount';
    return action(types.TAG_GET_ENTRIES_COUNT_ERROR, { error });
};

export const tagGetEntriesCountSuccess = data => action(types.TAG_GET_ENTRIES_COUNT_SUCCESS, { data });

export const tagSearch = tagName => action(types.TAG_SEARCH, { tagName });

export const tagSearchError = error => action(types.TAG_SEARCH_ERROR, { error });

export const tagSearchSuccess = data => action(types.TAG_SEARCH_SUCCESS, { data });

// export const tagSearchMoreSuccess = (tags, tagCount) =>
//     action(types.TAG_SEARCH_MORE_SUCCESS, { tags, tagCount });
