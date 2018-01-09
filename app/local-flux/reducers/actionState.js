import { fromJS, List } from 'immutable';
import { ActionRecord, ActionState } from './records';
import * as actionStatus from '../../constants/action-status';
import * as actionTypes from '../../constants/action-types';
import * as types from '../constants';
import { createReducer } from './create-reducer';

const initialState = new ActionState();

const createAction = (action) => {
    // convert the payload object to an immutable map
    const payload = fromJS(action.payload);
    return new ActionRecord(action).set('payload', payload);
};

export const sortByBlockNr = (byId, list, reverse) =>
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

const addPendingAction = (pending, action) => { // eslint-disable-line complexity
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
                return pending.setIn([action.type, entryId], new List([createAction(action)]));
            }
            return pending.setIn([action.type, entryId], pendingComments.push(createAction(action)));
        case actionTypes.commentDownvote:
        case actionTypes.commentUpvote:
            return pending.setIn(['commentVote', commentId], action.id);
        case actionTypes.createTag:
            return pending.setIn([action.type, tag], action.id);
        case actionTypes.follow:
        case actionTypes.unfollow:
            return pending.setIn(['follow', ethAddress], action.id);
        case actionTypes.sendTip:
            return pending.setIn([action.type, ethAddress], action.id);
        default:
            return pending;
    }
};

const removePendingAction = (pending, action) => { // eslint-disable-line complexity
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
            pendingComments = pendingEntry && pendingEntry.filter((comm) => {
                return comm.id !== action.id;
            });
            return pending.setIn([action.type, entryId], pendingComments);
        }
        case actionTypes.entryDownvote:
        case actionTypes.entryUpvote:
            return pending.deleteIn(['entryVote', entryId]);
        case actionTypes.commentDownvote:
        case actionTypes.commentUpvote:
            return pending.deleteIn(['commentVote', commentId]);
        case actionTypes.createTag:
            return pending.deleteIn([action.type, tag]);
        case actionTypes.follow:
        case actionTypes.unfollow:
            return pending.deleteIn(['follow', ethAddress]);
        case actionTypes.sendTip:
            return pending.deleteIn([action.type, ethAddress]);
        default:
            return pending;
    }
};

const actionState = createReducer(initialState, {
    [types.ACTION_ADD]: (state, { ethAddress, payload, actionType }) => {
        if (actionType === actionTypes.faucet) {
            const id = `${new Date().getTime()}-${actionType}`;
            const status = (actionType === actionTypes.faucet) ? actionStatus.toPublish : actionStatus.needAuth;
            const action = createAction({ id, ethAddress, payload, status, type: actionType });
            return state.merge({
                byId: state.get('byId').set(id, action),
                [status]: id,
            });
        }
        return state;
    },
    [types.ACTION_ADD_NO_FUNDS]: (state, action) => {
        const { ethAddress, payload, actionType, needEth, needAeth, needMana } = action;
        const id = `${new Date().getTime()}-${actionType}`;
        const status = (actionType === actionTypes.faucet) ? actionStatus.toPublish : actionStatus.needAuth;
        const publishAction = createAction({ id, ethAddress, payload, status, type: actionType });
        return state.merge({
            byId: state.get('byId').set(id, publishAction),
            [status]: id,
            needEth,
            needAeth,
            needMana
        });
    },
    [types.ACTION_ADD_SUCCESS]: (state, { ethAddress, payload, actionType }) => {
        if (actionType === actionTypes.faucet) {
            return state;
        }
        const id = `${new Date().getTime()}-${actionType}`;
        const status = (actionType === actionTypes.faucet) ? actionStatus.toPublish : actionStatus.needAuth;
        const action = createAction({ id, ethAddress, payload, status, type: actionType });
        return state.merge({
            byId: state.get('byId').set(id, action),
            [status]: id,
            needEth: false,
            needAeth: false,
            needMana: false,
        });
    },

    [types.ACTION_CLEAR_HISTORY]: state => state.merge({
        history: new List(),
        historyTypes: new List()
    }),

    [types.ACTION_DELETE]: (state, { id }) => {
        const needAuth = state.get('needAuth');
        const action = state.getIn(['byId', id]);
        if (!action) {
            return state;
        }
        const pending = removePendingAction(state.get('pending'), action.toJS());
        return state.merge({
            byId: state.get('byId').delete(id),
            needAuth: needAuth === id ? null : needAuth,
            pending,
        });
    },

    [types.ACTION_GET_CLAIMABLE]: state =>
        state.setIn(['flags', 'fetchingClaimable'], true),

    [types.ACTION_GET_CLAIMABLE_ERROR]: state =>
        state.setIn(['flags', 'fetchingClaimable'], false),

    [types.ACTION_GET_CLAIMABLE_SUCCESS]: (state, { data }) => {
        let list = new List();
        let byId = state.get('byId');
        data.forEach((action) => {
            const { success } = action;
            const { entryId, ethAddress } = action.payload;
            if (success && entryId && ethAddress) {
                byId = byId.set(action.id, createAction(action));
                list = list.push(action.id);
            }
        });
        list = sortByBlockNr(byId, list, true);
        const claimable = list.map(id => byId.getIn([id, 'payload', 'entryId']));
        return state.merge({
            byId,
            claimable,
            flags: state.get('flags').set('fetchingClaimable', false)
        });
    },

    [types.ACTION_GET_HISTORY]: state => state.setIn(['flags', 'fetchingHistory'], true),

    [types.ACTION_GET_HISTORY_ERROR]: state =>
        state.setIn(['flags', 'fetchingHistory'], false),

    [types.ACTION_GET_HISTORY_SUCCESS]: (state, { data, request }) => {
        let byId = state.get('byId');
        const fetchingAethTransfers = state.getIn(['flags', 'fetchingAethTransfers']);
        let list = fetchingAethTransfers ? new List() : state.get('history');
        data.forEach((action) => {
            byId = byId.set(action.id, createAction(action));
            list = list.push(action.id);
        });
        return state.merge({
            byId,
            flags: state.get('flags').set('fetchingHistory', false),
            history: sortByBlockNr(byId, list),
            historyTypes: new List(request)
        });
    },

    [types.ACTION_GET_PENDING_SUCCESS]: (state, { data }) => {
        let byId = state.get('byId');
        let pending = state.get('pending');
        let publishing = new List();
        data.forEach((action) => {
            byId = byId.set(action.id, createAction(action));
            pending = addPendingAction(pending, action);
            publishing = publishing.push(action.id);
        });
        return state.merge({
            byId,
            pending,
            publishing
        });
    },

    [types.ACTION_RESET_FUNDING_REQUIREMENTS]: state =>
        state.merge({
            needEth: false,
            needAeth: false,
            needMana: false
        }),

    [types.ACTION_PUBLISH]: (state, { id }) => {
        const action = state.getIn(['byId', id]);
        const pending = state.get('pending');
        return state.merge({
            needAuth: null,
            pending: addPendingAction(pending, action.toJS())
        });
    },
    [types.ACTION_UPDATE]: (state, { changes }) => {
        if (!changes || !changes.id) {
            return state;
        }
        const newActionId = state.getIn(['byId', changes.id]);
        if (!newActionId) {
            return state;
        }
        const newAction = state.getIn(['byId', changes.id]).mergeDeep(changes);
        let publishing = state.get('publishing');
        let pending = state.get('pending');
        const historyTypes = state.get('historyTypes');
        let history = state.get('history');
        if (changes.status === actionStatus.publishing) {
            publishing = publishing.push(changes.id);
            if (historyTypes.includes(newAction.type)) {
                history = history.unshift(newAction.id);
            }
        } else if (changes.status === actionStatus.published) {
            pending = removePendingAction(pending, newAction.toJS());
            publishing = publishing.filter(id => id !== changes.id);
        }
        return state.merge({
            byId: state.get('byId').set(changes.id, newAction),
            history,
            needAuth: changes.status === actionStatus.needAuth ? changes.id : state.get('needAuth'),
            pending,
            publishing
        });
    },

    [types.PROFILE_AETH_TRANSFERS_ITERATOR]: state =>
        state.setIn(['flags', 'fetchingAethTransfers'], true),

    [types.PROFILE_AETH_TRANSFERS_ITERATOR_ERROR]: state =>
        state.setIn(['flags', 'fetchingAethTransfers'], false),

    [types.PROFILE_AETH_TRANSFERS_ITERATOR_SUCCESS]: (state, { data }) => {
        const type = actionTypes.receiveAeth;
        const fetchingHistory = state.getIn(['flags', 'fetchingHistory']);
        let byId = state.get('byId');
        let list = fetchingHistory ? new List() : state.get('history');
        data.collection.forEach((event, index) => {
            const id = `${event.blockNumber}-${event.from.ethAddress}-${type}-${index}`;
            const payload = fromJS({ amount: event.amount });
            const action = new ActionRecord({ blockNumber: event.blockNumber, id, success: true, type })
                .set('payload', payload);
            if (!byId.get(action.id)) {
                byId = byId.set(action.id, action);
                list = list.push(action.id);
            }
        });
        return state.merge({
            byId,
            flags: state.get('flags').set('fetchingAethTransfers', false),
            history: sortByBlockNr(byId, list),
        });
    },

    [types.PROFILE_LOGOUT_SUCCESS]: () => initialState
});

export default actionState;
