import { createSelector } from 'reselect'


export const selectProfileSearchResults = state => state.searchState.get('profilesAutocomplete');

export const selectSearchQuery = state => state.searchState.get('query');

export const selectSearchQueryAutocomplete = state => state.searchState.get('queryAutocomplete');

export const selectSearchEntryOffset = state => state.searchState.offset;

export const selectSearchProfiles = state =>
    state.searchState.profiles.map(ethAddress => state.profileState.getIn(['byEthAddress', ethAddress]));

export const selectTagSearchResults = state => state.searchState.get('tags');

export const selectSearchTags = state => state.searchState.get('tags');
