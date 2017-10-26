import { action } from './helpers';
import * as types from '../constants';

export const searchMoreQuery = (text, offset) => action(types.SEARCH_MORE_QUERY, { text, offset });
export const searchMoreQuerySuccess = data => action(types.SEARCH_MORE_QUERY_SUCCESS, { data });
export const searchMoreQueryError = error => action(types.SEARCH_MORE_QUERY_ERROR, { error });

export const searchProfiles = query => action(types.SEARCH_PROFILES, { query });
export const searchProfilesError = (error) => {
    error.code = 'SPE01';
    error.messageId = 'searchProfiles';
    return action(types.SEARCH_PROFILES_ERROR, { error });
};
export const searchProfilesSuccess = data => action(types.SEARCH_PROFILES_SUCCESS, { data });

export const searchQuery = text => action(types.SEARCH_QUERY, { text });
export const searchQuerySuccess = data => action(types.SEARCH_QUERY_SUCCESS, { data });
export const searchQueryError = error => action(types.SEARCH_QUERY_ERROR, { error });

export const searchResetResults = () => action(types.SEARCH_RESET_RESULTS);

export const searchSyncTags = () => action(types.SEARCH_SYNC_TAGS);
export const searchSyncTagsError = (error) => {
    error.code = 'SSTE01';
    return action(types.SEARCH_SYNC_TAGS_ERROR, { error });
};
export const searchSyncTagsSuccess = data => action(types.SEARCH_SYNC_TAGS_SUCCESS, { data });

export const searchTags = query => action(types.SEARCH_TAGS, { query });
export const searchTagsError = (error) => {
    error.code = 'STE01';
    error.messageId = 'searchTags';
    return action(types.SEARCH_TAGS_ERROR, { error });
};
export const searchTagsSuccess = data => action(types.SEARCH_TAGS_SUCCESS, { data });
