/* eslint new-cap: [2, {capIsNewExceptions: ["Record"]}] */
import { fromJS, List, Map, Record } from 'immutable';
import * as tagTypes from '../constants/TagConstants';
import * as types from '../constants';
import { createReducer } from './create-reducer';

const TagMarginsRecord = Record({
    firstTag: null,
    lastTag: null
});

const initialState = fromJS({
    entriesCount: new Map(),
    flags: new Map({
        registerPending: new List(),
        searchPending: false
    }),
    margins: new TagMarginsRecord(),
    moreNewTags: false,
    newestTags: new List(),
    searchQuery: null,
    searchResults: new List()
});

const registerFlagHandler = (state, { error, flags }) => {
    const registerPending = state.getIn(['flags', 'registerPending']);
    const index = registerPending.findIndex(flag =>
        flag.tagName === flags.registerPending.tagName);
    if (error) {
        flags.registerPending.error = error;
    }
    if (index === -1) {
        return state.merge({
            flags: state.get('flags').merge({
                registerPending: state.getIn(['flags', 'registerPending'])
                    .push(flags.registerPending)
            }),
        });
    }
    return state.merge({
        flags: state.get('flags').mergeIn(['registerPending', index], flags.registerPending),
    });
};

const tagState = createReducer(initialState, {
    [tagTypes.REGISTER_TAG]: registerFlagHandler,

    [tagTypes.REGISTER_TAG_SUCCESS]: registerFlagHandler,

    [tagTypes.REGISTER_TAG_ERROR]: registerFlagHandler,

    [types.CLEAN_STORE]: () => initialState,

    // ************ NEW REDUCERS **********************

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

    [types.TAG_GET_MARGINS_SUCCESS]: (state, { data }) =>
        state.set('margins', new TagMarginsRecord(data)),

    [types.TAG_SAVE_SUCCESS]: (state, { data }) =>
        state.set('margins', new TagMarginsRecord(data)),

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
            searchResults: new List(data)
        }),

});

export default tagState;
