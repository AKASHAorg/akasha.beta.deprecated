import { fromJS, List, Map } from 'immutable';
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

const addPendingAction = (pending, action) => { // eslint-disable-line complexity
    const { bondAeth, claim, comment, commentDownvote, commentUpvote, createTag, cycleAeth,
        entryDownvote, entryUpvote, follow, profileRegister, profileUpdate,
        sendTip, unfollow } = actionTypes;
    const { commentId, entryId, ethAddress, tag } = action.payload;
    let pendingComments;
    switch (action.type) {
        case bondAeth:
            return pending.set(action.type, true);
        case claim:
            return pending.setIn([action.type, entryId], action.id);
        case entryDownvote:
        case entryUpvote:
            return pending.setIn(['entryVote', entryId], action.id);
        case comment:
            // Pending comments do not have a unique id, so they will be stored
            // in a List instead of a Map
            pendingComments = pending.getIn([action.type, entryId]);
            if (!pendingComments) {
                return pending.setIn([action.type, entryId], new List([createAction(action)]));
            }
            return pending.setIn([action.type, entryId], pendingComments.push(createAction(action)));
        case commentDownvote:
        case commentUpvote:
            if (!pending.getIn(['commentVote', entryId])) {
                return pending.setIn(['commentVote', entryId], new Map({ [commentId]: action.id }));
            }
            return pending.setIn(['commentVote', entryId, commentId], action.id);
        case createTag:
            return pending.setIn([createTag, tag], action.id);
        case cycleAeth:
            return pending.set(action.type, true);
        case follow:
        case unfollow:
            return pending.setIn(['follow', ethAddress], action.id);
        case sendTip:
            return pending.setIn([action.type, ethAddress], action.id);
        case profileRegister:
        case profileUpdate:
            return pending.set(action.type, true);
        default:
            return pending;
    }
};

const removePendingAction = (pending, action) => { // eslint-disable-line complexity
    const { bondAeth, claim, comment, commentDownvote, commentUpvote, cycleAeth, createTag,
        entryDownvote, entryUpvote, follow, profileRegister, profileUpdate,
        sendTip, unfollow } = actionTypes;
    const { commentId, entryId, ethAddress, tag } = action.payload;
    let pendingComments;
    switch (action.type) {
        case bondAeth:
            return pending.set(action.type, false);
        case claim:
        case comment:
            pendingComments = pending.getIn([action.type, entryId]).filter((comm) => {
                return comm.id !== action.id;
            });
            return pending.setIn([action.type, entryId], pendingComments);
        case cycleAeth:
            return pending.set(action.type, false);
        case entryDownvote:
        case entryUpvote:
            return pending.deleteIn(['entryVote', entryId]);
        case commentDownvote:
        case commentUpvote:
            return pending.deleteIn(['commentVote', entryId, commentId]);
        case createTag:
            return pending.deleteIn([createTag, tag]);
        case follow:
        case unfollow:
            return pending.deleteIn(['follow', ethAddress]);
        case sendTip:
            return pending.deleteIn([action.type, ethAddress]);
        case profileRegister:
        case profileUpdate:
            return pending.set(action.type, false);
        default:
            return pending;
    }
};

const actionState = createReducer(initialState, {
    [types.ACTION_ADD]: (state, { ethAddress, payload, actionType }) => {
        const id = `${new Date().getTime()}-${actionType}`;
        const status = actionStatus.needAuth;
        const action = createAction({ id, ethAddress, payload, status, type: actionType });
        return state.merge({
            byId: state.get('byId').set(id, action),
            [status]: id
        });
    },

    [types.ACTION_DELETE]: (state, { id }) => {
        const needAuth = state.get('needAuth');
        const action = state.getIn(['byId', id]);
        const pending = removePendingAction(state.get('pending'), action.toJS());
        return state.merge({
            byId: state.get('byId').delete(id),
            needAuth: needAuth === id ? null : needAuth,
            pending,
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
        const newAction = state.getIn(['byId', changes.id]).merge(changes);
        let publishing = state.get('publishing');
        let pending = state.get('pending');
        if (changes.status === actionStatus.publishing) {
            publishing = publishing.push(changes.id);
        } else if (changes.status === actionStatus.published) {
            pending = removePendingAction(pending, newAction.toJS());
            publishing = publishing.filter(id => id !== changes.id);
        }
        return state.merge({
            byId: state.get('byId').set(changes.id, newAction),
            needAuth: changes.status === actionStatus.needAuth ? changes.id : state.get('needAuth'),
            pending,
            publishing
        });
    },

    [types.PROFILE_LOGOUT_SUCCESS]: () => initialState
});

export default actionState;
