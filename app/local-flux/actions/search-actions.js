import { action } from './helpers';
import * as types from '../constants';

export const searchMoreProfiles = () => action(types.SEARCH_MORE_PROFILES);

export const searchMoreQuery = () => action(types.SEARCH_MORE_QUERY);
export const searchMoreQuerySuccess = data => action(types.SEARCH_MORE_QUERY_SUCCESS, { data });
export const searchMoreQueryError = error => action(types.SEARCH_MORE_QUERY_ERROR, { error });

export const searchProfiles = (query, autocomplete) => action(types.SEARCH_PROFILES, { query, autocomplete });
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

export const searchSyncEntries = following => action(types.SEARCH_SYNC_ENTRIES, { following });
export const searchSyncEntriesError = (error) => {
    error.code = 'SSEE01';
    return action(types.SEARCH_SYNC_ENTRIES_ERROR, { error });
};
export const searchSyncEntriesSuccess = data => action(types.SEARCH_SYNC_ENTRIES_SUCCESS, { data });

export const searchSyncTags = () => action(types.SEARCH_SYNC_TAGS);
export const searchSyncTagsError = (error) => {
    error.code = 'SSTE01';
    return action(types.SEARCH_SYNC_TAGS_ERROR, { error });
};
export const searchSyncTagsSuccess = data => action(types.SEARCH_SYNC_TAGS_SUCCESS, { data });

export const searchTags = (query, autocomplete) => action(types.SEARCH_TAGS, { query, autocomplete });
export const searchTagsError = (error) => {
    error.code = 'STE01';
    error.messageId = 'searchTags';
    return action(types.SEARCH_TAGS_ERROR, { error });
};
export const searchTagsSuccess = data => action(types.SEARCH_TAGS_SUCCESS, { data });
