/* eslint new-cap: [2, {capIsNewExceptions: ["Record"]}] */
import { fromJS, List, Map } from 'immutable';
import * as types from '../constants';
import { createReducer } from './create-reducer';

const initialState = fromJS({
    entriesCount: new Map(),
    flags: new Map({
        registerPending: new List(),
        searchPending: false
    }),
    moreNewTags: false,
    searchQuery: null,
    searchResults: new List()
});

// const registerFlagHandler = (state, { error, flags }) => {
//     const registerPending = state.getIn(['flags', 'registerPending']);
//     const index = registerPending.findIndex(flag =>
//         flag.tagName === flags.registerPending.tagName);
//     if (error) {
//         flags.registerPending.error = error;
//     }
//     if (index === -1) {
//         return state.merge({
//             flags: state.get('flags').merge({
//                 registerPending: state.getIn(['flags', 'registerPending'])
//                     .push(flags.registerPending)
//             }),
//         });
//     }
//     return state.merge({
//         flags: state.get('flags').mergeIn(['registerPending', index], flags.registerPending),
//     });
// };

const tagState = createReducer(initialState, {
    [types.CLEAN_STORE]: () => initialState,

    // ************ NEW REDUCERS **********************

    [types.TAG_GET_ENTRIES_COUNT_SUCCESS]: (state, { data }) => {
        if (!data.collection) {
            return state;
        }
        let entriesCount = state.get('entriesCount');
        data.collection.forEach((tag) => {
            entriesCount = entriesCount.set(tag.tag, tag.count);
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
            searchResults: new List(data)
        }),

});

export default tagState;
