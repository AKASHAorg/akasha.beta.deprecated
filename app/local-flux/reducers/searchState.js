import { List } from 'immutable';
import * as types from '../constants';
import { createReducer } from './utils';
import { entrySearchLimit } from '../../constants/iterator-limits';
import SearchStateModel from './state-models/search-state-model';
import { SEARCH_MODULE } from '@akashaproject/common/constants';

const initialState = new SearchStateModel();

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

    [`${ SEARCH_MODULE.findProfiles }`]: (state, { query, autocomplete }) => {
        if (autocomplete) {
            return state.merge({
                flags: state.get('flags').set('autocompletePending', true),
                profilesAutocomplete: new List(),
                queryAutocomplete: query.toLowerCase(),
            });
        }
        return state.merge({
            flags: state.get('flags').merge({
                queryPending: !!query.length,
                moreQueryPending: false
            }),
            profiles: new List(),
            query: query.toLowerCase(),
        });
    },

    [`${ SEARCH_MODULE.findProfiles }_ERROR`]: (state, { request }) => {
        if (request.autocomplete) {
            return state.setIn(['flags', 'autocompletePending'], false);
        }
        return state.setIn(['flags', 'queryPending'], false);
    },

    [`${ SEARCH_MODULE.findProfiles }_SUCCESS`]: (state, { data, request }) => {
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

    [`${ SEARCH_MODULE.query }`]: (state, { text }) =>
        state.merge({
            currentPage: null,
            entryIds: new List(),
            flags: state.get('flags').merge({
                queryPending: !!text.length,
                moreQueryPending: false
            }),
            offset: null,
            query: text,
            resultsCount: null,
            totalPages: null,
        }),

    [`${ SEARCH_MODULE.query }_SUCCESS`]: (state, { data }) =>
        state.merge({
            currentPage: 1,
            entryIds: new List(state.getEntryIds(data.collection)),
            flags: state.get('flags').merge({ queryPending: false }),
            offset: data.collection.length,
            resultsCount: data.totalHits,
            totalPages: Math.ceil(data.totalHits / entrySearchLimit),
        }),

    [`${ SEARCH_MODULE.query }_ERROR`]: state =>
        state.setIn(['flags', 'queryPending'], false),

    [types.SEARCH_RESET_RESULTS]: () => initialState,

    [`${ SEARCH_MODULE.findTags }`]: (state, { query }) =>
        state.merge({
            flags: state.get('flags').merge({
                queryPending: !!query.length,
                moreQueryPending: false
            }),
            query: query.toLowerCase(),
            tags: new List(),
            tagResultsCount: 0
        }),

    [`${ SEARCH_MODULE.findTags }_ERROR`]: state =>
        state.setIn(['flags', 'queryPending'], false),

    [`${ SEARCH_MODULE.findTags }_SUCCESS`]: (state, { data }) =>
        state.merge({
            flags: state.get('flags').set('queryPending', false),
            tags: new List(data),
            tagResultsCount: data.length,
        }),
});

export default searchState;
