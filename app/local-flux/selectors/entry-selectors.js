//@flow
import { createSelector } from 'reselect';
import { List } from 'immutable';

export const selectEntriesById = (state/*: Object */) => state.entryState.get('byId');
export const selectEntryById = (state/*: Object */, id/*: string*/) => state.entryState.getIn(['byId', id]);
export const selectEntryEndPeriod = (state/*: Object */) => state.entryState.get('endPeriod');
export const selectPendingEntriesFlags = (state/*: Object */) => state.entryState.getIn(['flags', 'pendingEntries']);
export const selectEntryFlag = (state/*: Object */, flag/*: string*/) => state.entryState.getIn(['flags', flag]);
export const selectEntryVote = (state/*: Object */, id/*: string*/) => state.entryState.getIn(['votes', id]);
export const selectFullEntry = (state/*: Object */) => state.entryState.get('fullEntry');
export const selectAllProfileEntries = (state/*: Object */, ethAddress/*: string */) =>
    state.entryState.getIn(['profileEntries', ethAddress])
export const selectLastStreamBlock = (state/*: Object */) => state.entryState.get('lastStreamBlock');
export const selectVoteCost = (state/*: Object */) => state.entryState.get('voteCostByWeight');
export const selectEntryBalance = (state/*: Object */, id/*: string*/) => state.entryState.getIn(['balance', id]);
export const selectEntryCanClaim = (state/*: Object */, id/*: string*/) => state.entryState.getIn(['canClaim', id]);
export const selectEntryCanClaimVote = (state/*: Object */, id/*: string*/) => state.entryState.getIn(['canClaimVote', id]);

/** getters (see ./README.md) */

// @todo add a comment for context param.
export const getPendingEntries = (state/*: Object */, context/*: string*/) => selectEntryFlag(state, 'pendingEntries').get(context);
export const getProfileEntries = (state/*: Object */, ethAddress/*: string*/) =>
    (selectAllProfileEntries(state, ethAddress).get('entryIds') || new List())
        .map(entryId => selectEntryById(state, entryId));

export const getProfileEntriesFlags = (state/*: Object */, ethAddress/*: string*/) => {
    const profileEntries = selectAllProfileEntries(state, ethAddress);
    if (!profileEntries) {
        return {};
    }
    return {
        fetchingEntries: profileEntries.get('fetchingEntries'),
        fetchingMoreEntries: profileEntries.get('fetchingMoreEntries'),
        moreEntries: profileEntries.get('moreEntries')
    };
};
export const getProfileEntriesLastBlock = (state/*: Object */, ethAddress/*: string */) =>
    selectAllProfileEntries(state, ethAddress).get('lastBlock');
export const getProfileEntriesLastIndex = (state/*: Object */, ethAddress/*: string */) =>
    selectAllProfileEntries(state, ethAddress).get('lastIndex');
export const getProfileEntriesCounter = (state/*: Object */, ethAddress/*: string*/) => {
    const allEntries = selectAllProfileEntries(state, ethAddress).get('entryIds');    
    return allEntries ? allEntries.size : null;
};