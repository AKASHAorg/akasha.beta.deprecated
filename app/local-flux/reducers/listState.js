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
    [types.ENTRY_LIST_ITERATOR_SUCCESS]: (state, { data, request }) => {
        if (request.length) {
            const startIndex = state.getIn(['byName', request[0].listName, 'startIndex']);
            const newIndex = data.data ? startIndex + 1 : startIndex;
            return state.mergeIn(['byName', request[0].listName], {
                moreEntries: newIndex < state.getIn(['byName', request[0].listName, 'entryIds']).size,
                startIndex: newIndex,
            });
        }
        return state;
    },

    [types.LIST_ADD_SUCCESS]: (state, { data }) =>
        state.setIn(['byName', data.name], createListRecord(data)),

    [types.LIST_DELETE_SUCCESS]: (state, { name }) =>
        state.deleteIn(['byName', name]),

    [types.LIST_DELETE_ENTRY_SUCCESS]: (state, { data }) =>
        state.setIn(['byName', data.name], createListRecord(data)),

    [types.LIST_GET_ALL_SUCCESS]: (state, { data }) => {
        let byName = state.get('byName');
        data.forEach((list) => {
            byName = byName.set(list.name, createListRecord(list));
        });
        return state.set('byName', byName);
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
            searchResults: data
        }),

    [types.LIST_TOGGLE_ENTRY_SUCCESS]: (state, { data }) =>
        state.setIn(['byName', data.name], createListRecord(data)),

    [types.PROFILE_LOGOUT_SUCCESS]: () => initialState
});

export default listState;
