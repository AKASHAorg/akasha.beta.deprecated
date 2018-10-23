// @flow
import { createSelector } from 'reselect'

/**
 * 'state slice' selectors (see ./README.md)
 */
export const selectActionById = (state/*: Object*/, id/*: string*/)/*: string*/ => state.actionState.getIn(['byId', id]);
export const selectActionHistory = (state/*: Object*/)/*: Object*/ => state.actionState.get('history');
export const selectBatchActions = (state/*: Object*/)/*: Object*/ => state.actionState.get('batchActions');
export const selectPendingActions = (state/*: Object*/)/*: Object*/ => state.actionState.get('pending');
export const selectActionToPublish = (state/*: Object*/)/*: Object*/ => state.actionState.get('toPublish');
export const selectClaimableActions = (state/*: Object*/)/*: Object*/ => state.actionState.get('claimable');
export const selectNeedAuthAction = (state/*: Object*/)/*: string*/ => state.actionState.get('needAuth');
export const selectHistoryFlags = (state/*: Object*/)/*: Object*/ => state.actionState.get('flags');
export const selectPublishingActions = (state/*: Object*/)/*: Object*/ => state.actionState.get('publishing');
export const selectPendingClaims = (state/*: Object*/)/*: Object*/ => selectPendingActions(state).get('claim');
export const selectPendingClaimVotes = (state/*: Object*/)/*: Object*/ => selectPendingActions(state).get('claimVote');

/** 
 * state "getters" (see ./README.md)
 * these methods should make use of the above state slice selectors
 * this will make state refactoring a breeze :)
 */
export const getActionHistory = (state/*: Object*/)/*: Object*/ =>
    selectActionHistory(state).map(id => selectActionById(state, id));

export const getBatchActions = (state/*: Object*/)/*: Array<Object>*/ =>
    selectBatchActions(state).map(actionId => selectActionById(state, actionId));

export const getPendingActionByType = (state/*: Object*/, actionType/*: string*/) =>
    selectPendingActions(state).get(actionType);

export const getClaimableActions = (state/*: Object*/) =>
    selectClaimableActions(state).map(actionId => selectActionById(state, actionId));

export const getNeedAuthAction = (state/*: Object*/) =>
    selectActionById(state, selectNeedAuthAction(state));

// @todo -> remove this flag
export const getFetchingHistoryFlag = (state/*: Object*/) =>
    selectHistoryFlags(state).get('fetchingHistory');
// @todo -> remove this flag
export const getFetchingMoreHistoryFlag = (state/*: Object*/) =>
    selectHistoryFlags(state).get('fetchingMoreHistory');

export const getPublishingActions = (state/*: Object*/) =>
    selectPublishingActions(state).map(id => selectActionById(state, id));

//@todo -> refactor all this flags
export const getFollowIsPending = (state/*: Object*/, ethAddress/*: string*/)/*: Boolean*/ =>
    !!selectPendingActions(state).getIn(['follow', ethAddress]);

//@todo -> refactor all this flags
export const getTipIsPending = (state/*: Object*/, akashaId/*: string*/)/*: Boolean*/ =>
    !!selectPendingActions(state).getIn(['sendTip', akashaId]);

//@todo -> refactor all this flags
export const getPendingEssenceTransform = (state/*: Object*/) =>
    selectPendingActions(state).get('transformEssence');

//@todo -> refactor all this flags
export const getVoteIsPending = (state/*: Object*/, entryId/*: Object*/)/*: Boolean*/ =>
    !!selectPendingActions(state).getIn(['entryVote', entryId]);

//@todo -> refactor all this flags
export const getPendingBondAeth = (state/*: Object*/) =>
    selectPendingActions(state).get('bondAeth');

//@todo -> refactor all this flags
export const getPendingCycleAeth = (state/*: Object*/) =>
    selectPendingActions(state).get('cycleAeth');

//@todo -> refactor all this flags
export const getClaimIsPending = (state/*: Object*/, entryId/*: string*/)/*: Boolean*/ =>
    !!selectPendingClaims(state).getIn(entryId);

//@todo -> refactor all this flags
export const getPendingClaimVote = (state/*: Object*/, entryId/*: string*/) =>
    !!selectPendingClaimVotes(state).get(entryId);

//@todo -> refactor all this flags
export const getPendingVotes = (state/*: Object*/) =>
    selectPendingActions(state).get('entryVote');


/**
 * composed selectors (using createSelector)
 * 
 */