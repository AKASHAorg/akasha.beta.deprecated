import { List } from 'immutable';
import * as types from '../constants';
import { createReducer } from './create-reducer';
import { ListRecord, ListState } from './records';

const initialState = new ListState();

const createListRecord = (list) => {
    if (list.entryIds && !List.isList(list.entryIds)) {
        list.entryIds = new List(list.entryIds);
    }
    return new ListRecord(list);
};

const listState = createReducer(initialState, {
    [types.LIST_ADD_ENTRY_SUCCESS]: (state, { data }) =>
        state.setIn(['byId', data.id], createListRecord(data)),

    [types.LIST_ADD_SUCCESS]: (state, { data }) =>
        state.setIn(['byId', data.id], createListRecord(data)),

    [types.LIST_DELETE_SUCCESS]: (state, { listId }) =>
        state.deleteIn(['byId', listId]),

    [types.LIST_DELETE_ENTRY_SUCCESS]: (state, { data }) =>
        state.setIn(['byId', data.id], createListRecord(data)),

    [types.LIST_GET_ALL_SUCCESS]: (state, { data }) => {
        let byId = state.get('byId');
        data.forEach((list) => {
            byId = byId.set(list.id, createListRecord(list));
        });
        return state.set('byId', byId);
    },

    [types.PROFILE_LOGOUT_SUCCESS]: () => initialState
});

export default listState;
