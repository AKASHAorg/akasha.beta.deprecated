/* eslint new-cap: [2, {capIsNewExceptions: ["Record"]}] */
import { List } from 'immutable';
import * as types from '../constants';
import TagStateModel from './state-models/tag-state-model';
import { createReducer } from './utils';
import { TAGS_MODULE } from '@akashaproject/common/constants';

const initialState = new TagStateModel();

const tagState = createReducer(initialState, {
    [types.CLEAN_STORE]: () => initialState,

    [`${ TAGS_MODULE.existsTag }`]: (state, { tagName }) =>
        state.setIn(['flags', 'existsPending', tagName], true),

    [`${ TAGS_MODULE.existsTag }_ERROR`]: (state, { request }) =>
        state.setIn(['flags', 'existsPending', request.tagName], false),

    [`${ TAGS_MODULE.existsTag }_SUCCESS`]: (state, { data }) =>
        state.merge({
            exists: state.get('exists').set(data.tagName, data.exists),
            flags: state.get('flags').setIn(['existsPending', data.tagName], false),
        }),

    [`${ TAGS_MODULE.tagCount }_SUCCESS`]: (state, { data }) => {
        if (!data.collection) {
            return state;
        }
        let entriesCount = state.get('entriesCount');
        data.collection.forEach((tag) => {
            entriesCount = entriesCount.set(tag.tag, tag.count);
        });
        return state.set('entriesCount', entriesCount);
    },

    [`${ TAGS_MODULE.searchTag }`]: (state, { tagName }) =>
        state.merge({
            flags: state.get('flags').set('searchPending', true),
            searchQuery: tagName
        }),

    [`${ TAGS_MODULE.searchTag }_ERROR`]: state =>
        state.setIn(['flags', 'searchPending'], false),

    [`${ TAGS_MODULE.searchTag }_SUCCESS`]: (state, { data }) =>
        state.merge({
            flags: state.get('flags').set('searchPending', false),
            searchResults: new List(data),
        }),
});

export default tagState;
