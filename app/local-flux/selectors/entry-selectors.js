import { createSelector } from 'reselect';

export const selectEntry = (state, id) => state.entryState.getIn(['byId', id]);

export const selectEntryEndPeriod = state => state.entryState.get('endPeriod');

export const selectEntryFlag = (state, flag) => state.entryState.getIn(['flags', flag]);

export const selectEntryVote = (state, id) => state.entryState.getIn(['votes', id]);

export const selectFullEntry = state =>
    state.entryState.get('fullEntry');


export const selectPendingEntries = (state, context) =>
    state.entryState.getIn(['flags', 'pendingEntries', context]);

export const selectProfileEntries = (state, ethAddress) =>
    (state.entryState.getIn(['profileEntries', ethAddress, 'entryIds']) || new List())
        .map(entryId => selectEntry(state, entryId));

export const selectProfileEntriesFlags = (state, ethAddress) => {
    const profileEntries = state.entryState.getIn(['profileEntries', ethAddress]);
    if (!profileEntries) {
        return {};
    }
    return {
        fetchingEntries: profileEntries.get('fetchingEntries'),
        fetchingMoreEntries: profileEntries.get('fetchingMoreEntries'),
        moreEntries: profileEntries.get('moreEntries')
    };
};

export const selectProfileEntriesLastBlock = (state, value) =>
    state.entryState.getIn(['profileEntries', value, 'lastBlock']);

export const selectProfileEntriesLastIndex = (state, value) =>
    state.entryState.getIn(['profileEntries', value, 'lastIndex']);

export const selectSearchEntries = state =>
    state.searchState.entryIds.map(entryId => state.entryState.getIn(['byId', entryId]));

export const selectLastStreamBlock = state => state.entryState.get('lastStreamBlock');

export const selectVoteCost = state => state.entryState.get('voteCostByWeight');

export const selectEntryBalance = (state, id) => state.entryState.getIn(['balance', id]);

export const selectEntryCanClaim = (state, id) => state.entryState.getIn(['canClaim', id]);

export const selectEntryCanClaimVote = (state, id) => state.entryState.getIn(['canClaimVote', id]);

export const selectCurrentTotalProfileEntries = (state, ethAddress) => {
    const entries = state.entryState.getIn(['profileEntries', ethAddress, 'entryIds']);    
    return entries ? entries.size : null;
};