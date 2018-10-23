// @flow
import { createSelector } from 'reselect';
import { selectProfileByEthAddress } from './profile-selectors';
import { selectEntryById } from './entry-selectors';

export const selectProfileSuggestions = (state/*: Object */) => state.searchState.get('profilesAutocomplete');
export const selectProfileSearchresults = (state/*: Object */) => state.searchState.get('profiles');
export const searchQuerySelector = (state/*: Object*/)=> state.searchState.get('query');
export const searchQueryAutocompleteSelector = (state/*: Object*/) => state.searchState.get('queryAutocomplete');
export const searchEntryOffsetSelector = (state/*: Object*/) => state.searchState.offset;
export const tagSearchResultsSelector = (state/*: Object */) => state.searchState.get('tags');
export const entrySearchResultsSelector = (state/*: Object */) => state.searchState.get('entryIds');


export const getProfileSearchResults = (state/*: Object*/) =>
    selectProfileSearchresults(state).map(ethAddress => selectProfileByEthAddress(state, ethAddress));

export const selectSearchEntries = (state/*: Object */) => entrySearchResultsSelector(state).map(entryId => selectEntryById(state, entryId));
