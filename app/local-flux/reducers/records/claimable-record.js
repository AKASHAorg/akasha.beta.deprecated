import { List, Record } from 'immutable';

export const ClaimableEntry = Record({
    blockNumber: null,
    endPeriod: null,
    entryId: null,
    isVote: null,
    weight: null
});

export const ClaimableState = Record({
    entriesLoading: List(),
    entriesLoadingMore: List(),    
    entryList: List(),
    moreEntries: null,
});
