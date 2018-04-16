import { List, Record } from 'immutable';

export const ClaimableEntry = Record({
    blockNumber: null,
    entryId: null,
    isVote: null,
    weight: null
});

export const ClaimableState = Record({
    entriesLoading: List(),
    entriesLoadingMore: List(),    
    entryList: List(),
    fetchingEntries: false,
    fetchingMoreEntries: false,
    moreEntries: null,
});
