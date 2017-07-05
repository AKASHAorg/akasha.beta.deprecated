import * as types from '../constants';
import { createReducer } from './create-reducer';
import { searchLimit } from '../../constants/iterator-limits';
import { SearchRecord } from './records/search-record';


const initialState = new SearchRecord();

function getEntryIds (entries) {
    return entries.map(entry => entry.entryId);
}


const searchState = createReducer(initialState, {
    [types.SEARCH_HANDSHAKE]: state =>
        state.setIn(['flags', 'handshakePending'], true),

    [types.SEARCH_HANDSHAKE_SUCCESS]: (state, { data }) =>
        state.merge({
            consecutiveQueryErrors: 0,
            searchService: data.searchService,
            flags: state.get('flags').merge({ handshakePending: false })
        }),

    [types.SEARCH_HANDSHAKE_ERROR]: state =>
        state.merge({
            searchService: null,
            flags: state.get('flags').set('handshakePending', false)
        }),

    [types.SEARCH_MORE_QUERY]: (state, { text }) =>
        state.merge({
            query: text,
            flags: state.get('flags').merge({ moreQueryPending: true })
        }),

    [types.SEARCH_MORE_QUERY_SUCCESS]: (state, { data }) =>
        state.merge({
            consecutiveQueryErrors: 0,
            currentPage: state.get('currentPage') + 1,
            totalPages: Math.ceil(data.total / searchLimit),
            resultsCount: data.total,
            flags: state.get('flags').merge({ moreQueryPending: false }),
            entryIds: state.get('entryIds').concat(getEntryIds(data.collection))
        }),

    [types.SEARCH_MORE_QUERY_ERROR]: state =>
        state.setIn(['flags', 'moreQueryPending'], false),


    [types.SEARCH_QUERY]: (state, { text }) =>
        state.merge({
            query: text,
            flags: state.get('flags').merge({ queryPending: true })
        }),

    [types.SEARCH_QUERY_SUCCESS]: (state, { data }) =>
        state.merge({
            consecutiveQueryErrors: 0,
            currentPage: 1,
            totalPages: Math.ceil(data.total / searchLimit),
            resultsCount: data.total,
            showResults: true,
            flags: state.get('flags').merge({ queryPending: false }),
            entryIds: getEntryIds(data.collection)
        }),

    [types.SEARCH_QUERY_ERROR]: state =>
        state.setIn(['flags', 'queryPending'], false),

    [types.SEARCH_RESET_RESULTS]: state =>
        state.merge({
            consecutiveQueryErrors: 0,
            currentPage: null,
            query: '',
            entryIds: [],
            totalPages: null,
            resultsCount: null,
            showResults: false
        }),
});

export default searchState;
