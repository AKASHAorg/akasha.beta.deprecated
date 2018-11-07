//@flow
import { createSelector } from 'reselect';
import { List } from 'immutable';

/*::
    type EntryByIdProps = {
        entryId: string
    }
    type EntryFlagProps = {
        flag: string
    }
    type AllProfileEntriesProps = {
        ethAddress: string
    }
    type PendingEntriesProps = {
        context: string
    }
    type ProfileEntriesProps = {
        ethAddress: string
    }
 */

export const selectEntriesById = (state/*: Object */) => state.entryState.get('byId');
export const selectEntryById = (state/*: Object */, props/*: EntryByIdProps*/) =>
    state.entryState.getIn(['byId', props.entryId]);
export const selectEntryEndPeriod = (state/*: Object */) =>
    state.entryState.get('endPeriod');
export const selectPendingEntriesFlags = (state/*: Object */) =>
    state.entryState.getIn(['flags', 'pendingEntries']);
export const selectEntryFlag = (state/*: Object */, props/*: EntryFlagProps*/) =>
    state.entryState.getIn(['flags', props.flag]);
export const selectEntryVote = (state/*: Object */, props/*: EntryByIdProps */) =>
    state.entryState.getIn(['votes', props.entryId]);
export const selectFullEntry = (state/*: Object */) => state.entryState.get('fullEntry');
export const selectAllProfileEntries = (state/*: Object */, props/*: AllProfileEntriesProps */) =>
    state.entryState.getIn(['profileEntries', props.ethAddress])
export const selectLastStreamBlock = (state/*: Object */) => state.entryState.get('lastStreamBlock');
export const selectVoteCost = (state/*: Object */) => state.entryState.get('voteCostByWeight');
export const selectEntryBalance = (state/*: Object */, props/*: EntryByIdProps*/) =>
    state.entryState.getIn(['balance', props.entryId]);
export const selectEntryCanClaim = (state/*: Object */, props/*: EntryByIdProps*/) =>
    state.entryState.getIn(['canClaim', props.entryId]);
export const selectEntryCanClaimVote = (state/*: Object */, props/*: EntryByIdProps*/) =>
    state.entryState.getIn(['canClaimVote', props.entryId]);

/** getters (see ./README.md) */

// @todo add a comment for context param.
// @param context <string> - eg. 'claimable'
export const getPendingEntries = (state/*: Object */, props/*: PendingEntriesProps*/) =>
    selectPendingEntriesFlags(state).get(props.context);
export const getProfileEntries = (state/*: Object */, props/*: ProfileEntriesProps*/) =>
    (selectAllProfileEntries(state, { ethAddress: props.ethAddress }).get('entryIds') || new List())
        .map((entryId/*: string */) => selectEntryById(state, { entryId }));

export const getProfileEntriesFlags = createSelector(
    [selectAllProfileEntries],
    (profileEntries/*: Object */) => {
        if (!profileEntries) return {};
        return {
            fetchingEntries: profileEntries.get('fetchingEntries'),
            fetchingMoreEntries: profileEntries.get('fetchingMoreEntries'),
            moreEntries: profileEntries.get('moreEntries')
        }
    } 
)

export const getProfileEntriesLastBlock = (state/*: Object */, props/*: ProfileEntriesProps */) =>
    selectAllProfileEntries(state, props).get('lastBlock');
export const getProfileEntriesLastIndex = (state/*: Object */, props/*: ProfileEntriesProps */) =>
    selectAllProfileEntries(state, props).get('lastIndex');
export const getProfileEntriesCounter = (state/*: Object */, props/*: ProfileEntriesProps */) => {
    const allEntries = selectAllProfileEntries(state, props).get('entryIds');    
    return allEntries ? allEntries.size : null;
};
