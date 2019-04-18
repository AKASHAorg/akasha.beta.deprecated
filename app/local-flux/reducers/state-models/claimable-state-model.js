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
    moreEntries: null,
});

export default class ClaimableStateModel extends ClaimableState {

}