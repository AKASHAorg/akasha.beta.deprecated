// @flow
import { List } from 'immutable';

/*::
    type EntryPendingCommentsProps = {
        commentId: string
    }
    type PendingByEntryIdProps = {
        entryId: string
    }
    type PendingByAkashaIdProps = {
        akashaId: string
    }
    type ActionByIdProps = {
        actionId: string
    }
    type ActionByTypeProps = {
        actionType: string
    }
    type PendingByEthAddressProps = {
        ethAddress: string
    }
*/

/**
 * 'state slice' selectors (see ./README.md)
 */
export const selectActionById = (state /*: Object*/, props /*: ActionByIdProps*/) /*: string*/ =>
    state.actionState.getIn(['byId', props.actionId]);
export const selectActionHistory = (state /*: Object*/) /*: Object*/ => state.actionState.get('history');
export const selectBatchActions = (state /*: Object*/) /*: Object*/ => state.actionState.get('batchActions');
export const selectPendingActions = (state /*: Object*/) /*: Object*/ => state.actionState.get('pending');
export const selectActionToPublish = (state /*: Object*/) /*: Object*/ => state.actionState.get('toPublish');
export const selectClaimableActions = (state /*: Object*/) /*: Object*/ => state.actionState.get('claimable');
export const selectNeedAuthAction = (state /*: Object*/) /*: string*/ => state.actionState.get('needAuth');
export const selectNeedAeth = (state /*: Object*/) /*: string*/ => state.actionState.get('needAeth');
export const selectNeedEth = (state /*: Object*/) /*: string*/ => state.actionState.get('needEth');
export const selectNeedMana = (state /*: Object*/) /*: string*/ => state.actionState.get('needMana');
export const selectHistoryFlags = (state /*: Object*/) /*: Object*/ => state.actionState.get('flags');
export const selectPublishingActions = (state /*: Object*/) /*: Object*/ =>
    state.actionState.get('publishing');
export const selectPendingClaims = (state /*: Object*/) /*: Object*/ =>
    selectPendingActions(state).get('claim');
export const selectPendingClaimVotes = (state /*: Object*/) /*: Object*/ =>
    selectPendingActions(state).get('claimVote');

/**
 * state "getters" (see ./README.md)
 * these methods should make use of the above state slice selectors
 * this will make state refactoring a breeze :)
 */
export const getActionHistory = (state /*: Object*/) /*: Object*/ =>
    selectActionHistory(state).map(actionid => selectActionById(state, actionid));

export const getBatchActions = (state /*: Object*/) /*: Array<Object>*/ =>
    selectBatchActions(state).map(actionId => selectActionById(state, actionId));

export const getPendingActionByType = (state /*: Object*/, props /*: ActionByTypeProps*/) =>
    selectPendingActions(state).get(props.actionType);

export const getClaimableActions = (state /*: Object*/) =>
    selectClaimableActions(state).map(actionId => selectActionById(state, actionId));

export const getNeedAuthAction = (state /*: Object*/) =>
    selectActionById(state, { actionId: selectNeedAuthAction(state) });

// @todo -> remove this flag
export const getFetchingHistoryFlag = (state /*: Object*/) =>
    selectHistoryFlags(state).get('fetchingHistory');
// @todo -> remove this flag
export const getFetchingMoreHistoryFlag = (state /*: Object*/) =>
    selectHistoryFlags(state).get('fetchingMoreHistory');

export const getPublishingActions = (state /*: Object*/) =>
    selectPublishingActions(state).map(id => selectActionById(state, id));

//@todo -> refactor all this flags
export const getFollowIsPending = (state /*: Object*/, props /*: PendingByEthAddressProps */) /*: Boolean*/ =>
    !!selectPendingActions(state).getIn(['follow', props.ethAddress]);

//@todo -> refactor all this flags
export const getTipIsPending = (state /*: Object*/, props /*: PendingByAkashaIdProps*/) /*: Boolean*/ =>
    !!selectPendingActions(state).getIn(['sendTip', props.akashaId]);

//@todo -> refactor all this flags
export const getPendingEssenceTransform = (state /*: Object*/) =>
    selectPendingActions(state).get('transformEssence');

//@todo -> refactor all this flags
export const getVoteIsPending = (state /*: Object*/, props /*: PendingByEntryIdProps*/) /*: Boolean*/ =>
    !!selectPendingActions(state).getIn(['entryVote', props.entryId]);

//@todo -> refactor all this flags
export const getPendingBondAeth = (state /*: Object*/) => selectPendingActions(state).get('bondAeth');

//@todo -> refactor all this flags
export const getPendingCycleAeth = (state /*: Object*/) => selectPendingActions(state).get('cycleAeth');

//@todo -> refactor all this flags
export const getClaimIsPending = (state /*: Object*/, props /*: PendingByEntryIdProps*/) /*: Boolean*/ =>
    !!selectPendingClaims(state).getIn(props.entryId);

//@todo -> refactor all this flags
export const getPendingClaimVote = (state /*: Object*/, props /*: PendingByEntryIdProps*/) =>
    !!selectPendingClaimVotes(state).get(props.entryId);

//@todo -> refactor all this flags
export const getPendingVotes = (state /*: Object*/) => selectPendingActions(state).get('entryVote');

export const getEntryPendingComments = (state /*: Object*/, props /*: Object*/) =>
    selectPendingActions(state).getIn(['comment', props.entryId]) || new List();

export const getPendingCommentVote = (state /*: Object*/, props /*: Object*/) =>
    selectPendingActions(state).getIn(['commentVote', props.commentId]);
