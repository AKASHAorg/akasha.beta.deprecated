import { List, Record, Map, fromJS } from 'immutable';
import * as actionTypes from '../../../constants/action-types';

export const ActionRecord = Record({
    blockNumber: null,
    cumulativeGasUsed: null,
    ethAddress: null,
    id: null,
    payload: new Map(),
    status: null,
    success: null,
    tx: null,
    type: null
});

// const Flags = Record({
//     fetchingAethTransfers: false,
//     fetchingHistory: false,
// });

export const ActionState = Record({
    allActions: new List(),
    batchActions: new List(),
    byId: new Map(),
    byType: new Map(),
    // flags: new Flags(),
    history: new List(),
    historyTypes: new List(),
    // needAuth: null,
    // needEth: null,
    // needAeth: null,
    // needMana: null,
    pending: new Map({
        bondAeth: false,
        claim: new Map(),
        claimVote: new Map(),
        comment: new Map(),
        commentVote: new Map(),
        cycleAeth: null,
        createTag: new Map(),
        entryVote: new Map(),
        follow: new Map(),
        profileRegister: false,
        profileUpdate: false,
        sendTip: new Map(),
        toggleDonations: false
    }),
    published: new List(),
    publishing: new List(),
    toPublish: null
});

export default class ActionStateModel extends ActionState {
    createAction (action) {
        // convert the payload object to an immutable map
        const payload = fromJS(action.payload);
        return new ActionRecord(action).set('payload', payload);
    }

    sortByBlockNr (byId, list, reverse) {
        list.sort((a, b) => {
            const actionA = byId.get(a);
            const actionB = byId.get(b);

            if (!actionB.blockNumber) {
                return reverse ? -1 : 1;
            }
            if (!actionA.blockNumber || actionA.blockNumber > actionB.blockNumber) {
                return reverse ? 1 : -1;
            }
            if (actionA.blockNumber < actionB.blockNumber) {
                return reverse ? -1 : 1;
            }
            return 0;
        });
    }

    addPendingAction (pending, action) { // eslint-disable-line complexity
        const { commentId, entryId, ethAddress, tag } = action.payload;
        let pendingComments;
        switch (action.type) {
            case actionTypes.bondAeth:
            case actionTypes.faucet:
            case actionTypes.freeAeth:
            case actionTypes.toggleDonations:
            case actionTypes.transferAeth:
            case actionTypes.transferEth:
            case actionTypes.transformEssence:
            case actionTypes.profileRegister:
            case actionTypes.profileUpdate:
                return pending.set(action.type, true);
            case actionTypes.cycleAeth:
                return pending.set(action.type, action.payload.amount);
            case actionTypes.claim:
            case actionTypes.claimVote:
                return pending.setIn([action.type, entryId], true);
            case actionTypes.entryDownvote:
            case actionTypes.entryUpvote:
                return pending.setIn(['entryVote', entryId], action.id);
            case actionTypes.comment:
                // Pending comments do not have a unique id, so they will be stored
                // in a List instead of a Map
                pendingComments = pending.getIn([action.type, entryId]);
                if (!pendingComments) {
                    return pending.setIn([action.type, entryId], List([this.createAction(action)]));
                }
                return pending.setIn([action.type, entryId], pendingComments.push(this.createAction(action)));
            case actionTypes.commentDownvote:
            case actionTypes.commentUpvote:
                return pending.setIn(['commentVote', commentId], action.id);
            case actionTypes.tagCreate:
                return pending.setIn([action.type, tag], action.id);
            case actionTypes.follow:
            case actionTypes.unfollow:
                return pending.setIn(['follow', ethAddress], action.id);
            case actionTypes.sendTip:
                return pending.setIn([action.type, ethAddress], action.id);
            default:
                return pending;
        }
    }
    removePendingAction (pending, action) { // eslint-disable-line complexity
        const { commentId, entryId, ethAddress, tag } = action.payload;
        let pendingComments;
        switch (action.type) {
            case actionTypes.bondAeth:
            case actionTypes.faucet:
            case actionTypes.freeAeth:
            case actionTypes.toggleDonations:
            case actionTypes.transferAeth:
            case actionTypes.transferEth:
            case actionTypes.transformEssence:
            case actionTypes.profileRegister:
            case actionTypes.profileUpdate:
                return pending.set(action.type, false);
            case actionTypes.cycleAeth:
                return pending.set(action.type, null);
            case actionTypes.claim:
            case actionTypes.claimVote:
                return pending.setIn([action.type, entryId], false);
            case actionTypes.comment: {
                const pendingEntry = pending.getIn([action.type, entryId]);
                pendingComments = pendingEntry && pendingEntry.filter((comm) => comm.id !== action.id);
                return pending.setIn([action.type, entryId], pendingComments);
            }
            case actionTypes.entryDownvote:
            case actionTypes.entryUpvote:
                return pending.deleteIn(['entryVote', entryId]);
            case actionTypes.commentDownvote:
            case actionTypes.commentUpvote:
                return pending.deleteIn(['commentVote', commentId]);
            case actionTypes.tagCreate:
                return pending.deleteIn([action.type, tag]);
            case actionTypes.follow:
            case actionTypes.unfollow:
                return pending.deleteIn(['follow', ethAddress]);
            case actionTypes.sendTip:
                return pending.deleteIn([action.type, ethAddress]);
            default:
                return pending;
        }
    }
}

global.ActionStateModel = ActionStateModel;
