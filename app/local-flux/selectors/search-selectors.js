// @flow
import { selectProfileByEthAddress } from './profile-selectors';
import { selectEntryById } from './entry-selectors';

export const selectProfileSuggestions = (state/*: Object */) => state.searchState.get('profilesAutocomplete');
export const selectProfileSearchresults = (state/*: Object */) => state.searchState.get('profiles');
export const selectSearchQuery = (state/*: Object*/)=> state.searchState.get('query');
export const selectSearchQueryAutocomplete = (state/*: Object*/) =>
    state.searchState.get('queryAutocomplete');
export const selectSearchEntryOffset = (state/*: Object*/) => state.searchState.offset;
export const selectTagSearchResults = (state/*: Object */) => state.searchState.get('tags');
export const selectEntrySearchResults = (state/*: Object */) => state.searchState.get('entryIds');


export const getProfileSearchResults = (state/*: Object*/) =>
    selectProfileSearchresults(state).map((ethAddress/*: string */) =>
        selectProfileByEthAddress(state, { ethAddress }));

export const getEntrySearchResults = (state/*: Object */) =>
    selectEntrySearchResults(state).map((entryId/*: string */) =>
        selectEntryById(state, { entryId }));
