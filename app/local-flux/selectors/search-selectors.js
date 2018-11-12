// @flow
import { selectProfileByEthAddress } from './profile-selectors';
import { selectEntryById } from './entry-selectors';

export const selectProfileSuggestions = (state/*: Object */) => state.searchState.get('profilesAutocomplete');
export const selectProfileSearchResults = (state/*: Object */) => state.searchState.get('profiles');
export const selectSearchQuery = (state/*: Object*/)=> state.searchState.get('query');
export const selectSearchQueryAutocomplete = (state/*: Object*/) => state.searchState.get('queryAutocomplete');
export const selectSearchEntryOffset = (state/*: Object*/) => state.searchState.offset;
export const selectTagSearchResults = (state/*: Object */) => state.searchState.get('tags');
export const selectTagSearchResultsCount = (state/*: Object */) => state.searchState.get('tagResultsCount');
export const selectSearchResultsCount = (state/*: Object */) => state.searchState.get('resultsCount');
export const selectEntrySearchResults = (state/*: Object */) => state.searchState.get('entryIds');
export const selectSearchFlags = (state/*: Object */) => state.searchState.get('flags');
export const selectSearchEntryOffset = (state/*: Object */) => state.searchState.get('offset');


export const getProfileSearchResults = (state/*: Object*/) =>
    selectProfileSearchResults(state).map((ethAddress/*: string */) => selectProfileByEthAddress(state, { ethAddress }));

export const selectSearchEntries = (state/*: Object */) =>
    entrySearchResultsSelector(state).map((entryId/*: string */) => selectEntryById(state, { entryId }));

export const getSearchQueryPending = (state/*: Object */) => selectSearchFlags(state).get('queryPending')
export const getSearchMoreQueryPending = (state/*: Object */) => selectSearchFlags(state).get('moreQueryPending')
