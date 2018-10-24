// @flow
import { Map } from 'immutable';
import { selectEntriesById } from './entry-selectors';

export const selectClaimableLoading = (state/*: Object */)=> !!state.claimableState.get('entriesLoading').size;
export const selectClaimableLoadingMore = (state/*: Object */)=> !!state.claimableState.get('entriesLoadingMore').size;
export const selectClaimableMoreEntries = (state/*: Object */)=> state.claimableState.get('moreEntries');
export const selectClaimableEntries = (state/*: Object */) => state.claimableState.get('entryList');

/** getters (see ./README.md) */
export const getClaimableEntriesCounter = (state/*: Object */)=> selectClaimableEntries(state).size;
export const getClaimableEntriesById = (state/*: Object */) => {
    const entryById = selectEntriesById(state);
    let entries = new Map();
    selectClaimableEntries(state).forEach((claimableEntry) => {
        entries = entries.set(claimableEntry.entryId, entryById.get(claimableEntry.entryId));
    });
    return entries;
};
