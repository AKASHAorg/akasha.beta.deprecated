import { List } from 'immutable';
import * as types from '../constants';
import { createReducer } from './utils';
import ListStateModel from './state-models/list-state-model';

const initialState = new ListStateModel();

const listState = createReducer(initialState, {
    // [types.ENTRY_LIST_ITERATOR_SUCCESS]: (state, { data, request }) => {
    //     const startIndex = data.collection.length;
    //     const entryIds = state.getIn(['byId', request.value, 'entryIds']);
    //     const moreEntries = entryIds && startIndex < entryIds.size;
    //     return state.mergeIn(['byId', request.value], {
    //         moreEntries,
    //         startIndex,
    //     });
    // },

    [types.ENTRY_MORE_LIST_ITERATOR_SUCCESS]: (state, { data, request }) => {
        const startIndex = state.getIn(['byId', request.value, 'startIndex']);
        const newIndex = startIndex + data.collection.length;
        return state.mergeIn(['byId', request.value], {
            moreEntries: newIndex < state.getIn(['byId', request.value, 'entryIds']).size,
            startIndex: newIndex,
        });
    },

    [types.LIST_ADD_SUCCESS]: (state, { data }) =>
        state.setIn(['byId', data.id], state.createListRecord(data)),

    [types.LIST_DELETE_SUCCESS]: (state, { id }) =>
        state.deleteIn(['byId', id]),

    [types.LIST_DELETE_ENTRY_SUCCESS]: (state, { data }) =>
        state.setIn(['byId', data.id], state.createListRecord(data)),

    [types.LIST_EDIT_SUCCESS]: (state, { data }) => {
        const byId = state.get('byId');
        const oldList = byId.filter(list => list.id === data.id).first();
        const newState = state.deleteIn(['byId', oldList.get('id')]);
        return newState.setIn(['byId', data.id], state.createListRecord(data));
    },

    [types.LIST_GET_ALL_SUCCESS]: (state, { data }) => {
        let byId = state.get('byId');
        data.forEach((list) => {
            byId = byId.set(list.id, state.createListRecord(list));
        });
        return state.set('byId', byId);
    },

    [types.LIST_SEARCH]: (state, { search }) =>
        state.merge({
            flags: state.get('flags').set('searching', true),
            search
        }),

    [types.LIST_SEARCH_ERROR]: state => state.setIn(['flags', 'searching'], false),

    [types.LIST_SEARCH_SUCCESS]: (state, { data }) =>
        state.merge({
            flags: state.get('flags').set('searching', false),
            searchResults: new List(data)
        }),

    [types.LIST_TOGGLE_ENTRY_SUCCESS]: (state, { data }) =>
        state.setIn(['byId', data.id], state.createListRecord({...data, startIndex: data.entryIds.length})),

    [types.PROFILE_LOGOUT_SUCCESS]: () => initialState
});

export default listState;
