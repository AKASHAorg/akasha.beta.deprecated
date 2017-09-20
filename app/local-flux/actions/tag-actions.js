import * as types from '../constants';
import { action } from './helpers';

export const tagCreate = ({ tagName }) => action(types.TAG_CREATE, { tagName });

export const tagGetEntriesCount = tags => action(types.TAG_GET_ENTRIES_COUNT, { tags });

export const tagGetEntriesCountError = (error) => {
    error.code = 'TGECE01';
    error.messageId = 'tagGetEntriesCount';
    return action(types.TAG_GET_ENTRIES_COUNT_ERROR, { error });
};

export const tagGetEntriesCountSuccess = data => action(types.TAG_GET_ENTRIES_COUNT_SUCCESS, { data });

export const tagGetMarginsError = (error) => {
    error.code = 'TGLE01';
    return action(types.TAG_GET_MARGINS_ERROR, { error });
};

export const tagGetMarginsSuccess = data => action(types.TAG_GET_MARGINS_SUCCESS, { data });
export const tagIterator = () => action(types.TAG_ITERATOR);

export const tagIteratorError = (error) => {
    error.code = 'TIE01';
    return action(types.TAG_ITERATOR_ERROR, { error });
};

export const tagSave = data => action(types.TAG_SAVE, { data });

export const tagSaveError = (error) => {
    error.code = 'TSE01';
    return action(types.TAG_SAVE_ERROR, { error });
};

export const tagSaveSuccess = data => action(types.TAG_SAVE_SUCCESS, { data });

export const tagSearch = tagName => action(types.TAG_SEARCH, { tagName });

export const tagSearchError = error => action(types.TAG_SEARCH_ERROR, { error });

export const tagSearchSuccess = data => action(types.TAG_SEARCH_SUCCESS, { data });

export const tagSearchLocal = tag => action(types.TAG_SEARCH_LOCAL, { tag });

export const tagSearchLocalError = error => action(types.TAG_SEARCH_LOCAL_ERROR, { error });

export const tagSearchLocalSuccess = (tags, tagCount) =>
    action(types.TAG_SEARCH_LOCAL_SUCCESS, { tags, tagCount });

export const tagSearchLocalMore = (tag, start) => action(types.TAG_SEARCH_LOCAL_MORE, { tag, start });

export const tagSearchLocalMoreError = error => action(types.TAG_SEARCH_LOCAL_MORE_ERROR, { error });

export const tagSearchLocalMoreSuccess = (tags, tagCount) =>
    action(types.TAG_SEARCH_LOCAL_MORE_SUCCESS, { tags, tagCount });
