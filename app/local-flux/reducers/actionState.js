import { fromJS, List } from 'immutable';
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
        let publishing = new List();
        data.forEach((action) => {
            byId = byId.set(action.id, createAction(action));
            publishing = publishing.push(action.id);
        });
        return state.merge({
            byId,
            publishing
        });
    },

    [types.ACTION_PUBLISH]: state => state.set('needAuth', null),

    [types.ACTION_UPDATE]: (state, { changes }) => {
        if (!changes || !changes.id) {
            return state;
        }
        const newAction = state.getIn(['byId', changes.id]).merge(changes);
        let publishing = state.get('publishing');
        if (changes.status === actionStatus.publishing) {
            publishing = publishing.push(changes.id);
        } else if (changes.status === actionStatus.published) {
            publishing = publishing.filter(id => id !== changes.id);
        }
        return state.merge({
            byId: state.get('byId').set(changes.id, newAction),
            needAuth: changes.status === actionStatus.needAuth ? changes.id : state.get('needAuth'),
            publishing
        });
    },

    [types.PROFILE_LOGOUT_SUCCESS]: () => initialState
});

export default actionState;
