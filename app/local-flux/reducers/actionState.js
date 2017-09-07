import { fromJS } from 'immutable';
import { ActionRecord, ActionState } from './records';
import * as actionStatus from '../../constants/action-status';
import * as types from '../constants';
import { createReducer } from './create-reducer';

const initialState = new ActionState();

const createAction = (action) => {
    // convert the payload object to an immutable map
    const payload = fromJS(action.payload);
    return new ActionRecord(action).set('payload', payload);
};

const actionState = createReducer(initialState, {
    [types.ACTION_ADD]: (state, { akashaId, payload, actionType }) => {
        const id = `${new Date().getTime()}-${actionType}`;
        const status = actionStatus.needAuth;
        if (!status) {
            return state;
        }
        const action = createAction({ id, akashaId, payload, status, type: actionType });
        return state.merge({
            byId: state.get('byId').set(id, action),
            [status]: id
        });
    },

    [types.ACTION_DELETE]: (state, { id }) => {
        const needAuth = state.get('needAuth');
        return state.merge({
            byId: state.get('byId').delete(id),
            needAuth: needAuth === id ? null : needAuth,
        });
    },

    [types.ACTION_GET_PENDING_SUCCESS]: (state, { data }) => {
        let byId = state.get('byId');
        data.forEach((action) => {
            byId = byId.set(action.id, createAction(action));
        });
        return state.set('byId', byId);
    },

    [types.ACTION_PUBLISH]: state => state.set('needAuth', null),

    [types.ACTION_UPDATE]: (state, { changes }) => {
        if (!changes || !changes.id) {
            return state;
        }
        const newAction = state.getIn(['byId', changes.id]).merge(changes);
        return state.merge({
            byId: state.get('byId').set(changes.id, newAction),
            needAuth: changes.status === actionStatus.needAuth ? changes.id : state.get('needAuth')
        });
    },

    [types.PROFILE_LOGOUT_SUCCESS]: () => initialState
});

export default actionState;
