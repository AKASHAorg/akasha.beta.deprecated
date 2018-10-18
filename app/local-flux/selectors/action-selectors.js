import { createSelector } from 'reselect'

export const selectAction = (state, id) => state.actionState.getIn(['byId', id]);

export const selectActionsHistory = state =>
    state.actionState.get('history').map(id => selectAction(state, id));

export const selectActionPending = (state, actionType) =>
    state.actionState.getIn(['pending', actionType]);

export const selectActionPendingAll = state => state.actionState.get('pending');

export const selectActionToPublish = state => state.actionState.get('toPublish');

export const selectBatchActions = state =>
    state.actionState.get('batchActions').map(actionId => selectAction(state, actionId));

export const selectClaimableActions = state =>
    state.actionState.get('claimable').map(actionId => selectAction(state, actionId));

export const selectNeedAuthAction = state =>
    state.actionState.getIn(['byId', state.actionState.get('needAuth')]);

export const selectFetchingHistory = state => state.actionState.getIn(['flags', 'fetchingHistory']);

export const selectFetchingMoreHistory = state => state.actionState.getIn(['flags', 'fetchingMoreHistory']);

export const selectPendingActionByType = (state, actionType) =>
    state.actionState.getIn(['pending', actionType]);

export const selectPublishingActions = state =>
    state.actionState.get('publishing').map(id => selectAction(state, id));

export const selectPendingFollow = (state, ethAddress) =>
    !!state.actionState.getIn(['pending', 'follow', ethAddress]);

export const selectPendingTip = (state, akashaId) =>
    !!state.actionState.getIn(['pending', 'sendTip', akashaId]);

export const selectPendingTransformEssence = state =>
    state.actionState.getIn(['pending', 'transformEssence']);

export const selectPendingVote = (state, entryId) =>
    !!state.actionState.getIn(['pending', 'entryVote', entryId]);

export const selectPendingBondAeth = state => state.actionState.getIn(['pending', 'bondAeth']);

export const selectPendingCycleAeth = state => state.actionState.getIn(['pending', 'cycleAeth']);


export const selectPendingClaim = (state, entryId) =>
    !!state.actionState.getIn(['pending', 'claim', entryId]);

export const selectPendingClaims = state =>
    state.actionState.getIn(['pending', 'claim']);

export const selectPendingClaimVote = (state, entryId) =>
    !!state.actionState.getIn(['pending', 'claimVote', entryId]);

export const selectPendingClaimVotes = state =>
    state.actionState.getIn(['pending', 'claimVote']);

export const selectAllPendingClaims = state => state.actionState.getIn(['pending', 'claim']);

export const selectAllPendingVotes = state => state.actionState.getIn(['pending', 'entryVote']);
