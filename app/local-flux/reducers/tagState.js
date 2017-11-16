/* eslint new-cap: [2, {capIsNewExceptions: ["Record"]}] */
import { List } from 'immutable';
import * as types from '../constants';
import { TagRecord } from './records';
import { createReducer } from './create-reducer';

const initialState = new TagRecord();

const tagState = createReducer(initialState, {
    [types.CLEAN_STORE]: () => initialState,

    [types.TAG_EXISTS]: (state, { tagName }) =>
        state.setIn(['flags', 'existsPending', tagName], true),

    [types.TAG_EXISTS_ERROR]: (state, { request }) =>
        state.setIn(['flags', 'existsPending', request.tagName], false),

    [types.TAG_EXISTS_SUCCESS]: (state, { data }) =>
        state.merge({
            exists: state.get('exists').set(data.tagName, data.exists),
            flags: state.get('flags').setIn(['existsPending', data.tagName], false),
        }),

    [types.TAG_GET_ENTRIES_COUNT_SUCCESS]: (state, { data }) => {
        if (!data.collection) {
            return state;
        }
        let entriesCount = state.get('entriesCount');
        data.collection.forEach((tag) => {
            entriesCount = entriesCount.set(tag.tagName, tag.count);
        });
        return state.set('entriesCount', entriesCount);
    },

    [types.TAG_SEARCH]: (state, { tagName }) =>
        state.merge({
            flags: state.get('flags').set('searchPending', true),
            searchQuery: tagName
        }),

    [types.TAG_SEARCH_ERROR]: state =>
        state.setIn(['flags', 'searchPending'], false),

    [types.TAG_SEARCH_SUCCESS]: (state, { data }) =>
        state.merge({
            flags: state.get('flags').set('searchPending', false),
            searchResults: new List(data),
        }),
});

export default tagState;
