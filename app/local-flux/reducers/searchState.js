import { List } from 'immutable';
import * as types from '../constants';
import { createReducer } from './create-reducer';
import { entrySearchLimit } from '../../constants/iterator-limits';
import { SearchRecord } from './records/search-record';

const initialState = new SearchRecord();

function getEntryIds (entries) {
    return entries.map(entry => entry.entryId);
}

const searchState = createReducer(initialState, {
    [types.SEARCH_MORE_QUERY]: state =>
        state.setIn(['flags', 'moreQueryPending'], true),

    [types.SEARCH_MORE_QUERY_SUCCESS]: (state, { data }) => {
        let entryIds = state.get('entryIds');
        data.collection.forEach((entry) => {
            if (!entryIds.includes(entry.entryId)) {
                entryIds = entryIds.push(entry.entryId);
            }
        });
        return state.merge({
            currentPage: state.get('currentPage') + 1,
            entryIds,
            flags: state.get('flags').merge({ moreQueryPending: false }),
            offset: state.get('offset') + data.collection.length,
            resultsCount: data.totalHits,
            totalPages: Math.ceil(data.totalHits / entrySearchLimit),
        });
    },

    [types.SEARCH_MORE_QUERY_ERROR]: state =>
        state.merge({
            flags: state.get('flags').merge({ moreQueryPending: false })
        }),

    [types.SEARCH_PROFILES]: (state, { query, autocomplete }) => {
        if (autocomplete) {
            return state.merge({
                flags: state.get('flags').set('autocompletePending', true),
                profilesAutocomplete: new List(),
                queryAutocomplete: query.toLowerCase(),
            });
        }
        return state.merge({
            flags: state.get('flags').merge({ queryPending: !!query.length, moreQueryPending: false }),
            profiles: new List(),
            query: query.toLowerCase(),
        });
    },

    [types.SEARCH_PROFILES_ERROR]: (state, { request }) => {
        if (request.autocomplete) {
            return state.setIn(['flags', 'autocompletePending'], false);
        }
        return state.setIn(['flags', 'queryPending'], false);
    },

    [types.SEARCH_PROFILES_SUCCESS]: (state, { data, request }) => {
        if (request.autocomplete) {
            return state.merge({
                flags: state.get('flags').set('autocompletePending', false),
                profilesAutocomplete: new List(data)
            });
        }
        return state.merge({
            flags: state.get('flags').set('queryPending', false),
            profiles: new List(data)
        });
    },

    [types.SEARCH_QUERY]: (state, { text }) =>
        state.merge({
            currentPage: null,
            entryIds: new List(),
            flags: state.get('flags').merge({ queryPending: !!text.length, moreQueryPending: false }),
            offset: null,
            query: text,
            resultsCount: null,
            totalPages: null,
        }),

    [types.SEARCH_QUERY_SUCCESS]: (state, { data }) =>
        state.merge({
            currentPage: 1,
            entryIds: new List(getEntryIds(data.collection)),
            flags: state.get('flags').merge({ queryPending: false }),
            offset: data.collection.length,
            resultsCount: data.totalHits,
            totalPages: Math.ceil(data.totalHits / entrySearchLimit),
        }),

    [types.SEARCH_QUERY_ERROR]: state =>
        state.setIn(['flags', 'queryPending'], false),

    [types.SEARCH_RESET_RESULTS]: () => initialState,

    [types.SEARCH_TAGS]: (state, { query }) =>
        state.merge({
            flags: state.get('flags').merge({ queryPending: !!query.length, moreQueryPending: false }),
            query: query.toLowerCase(),
            tags: new List(),
            tagResultsCount: 0
        }),

    [types.SEARCH_TAGS_ERROR]: state =>
        state.setIn(['flags', 'queryPending'], false),

    [types.SEARCH_TAGS_SUCCESS]: (state, { data }) =>
        state.merge({
            flags: state.get('flags').set('queryPending', false),
            tags: new List(data),
            tagResultsCount: data.length,
        }),
});

export default searchState;
