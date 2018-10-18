
import { Map } from 'immutable';

export const selectClaimableEntries = state => state.claimableState.get('entryList');

export const selectClaimableEntriesById = (state) => {
    const entryById = state.entryState.get('byId');
    let entries = new Map();
    state.claimableState.get('entryList').forEach((claimableEntry) => {
        entries = entries.set(claimableEntry.entryId, entryById.get(claimableEntry.entryId));
    });
    return entries;
};

export const selectClaimableLoading = state => !!state.claimableState.get('entriesLoading').size;

export const selectClaimableLoadingMore = state => !!state.claimableState.get('entriesLoadingMore').size;

export const selectClaimableMoreEntries = state => state.claimableState.get('moreEntries');

export const selectClaimableOffset = state => state.claimableState.get('entryList').size;


