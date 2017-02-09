import { fromJS, List, Map, Record } from 'immutable';
import * as types from '../constants/SearchConstants';
import { createReducer } from './create-reducer';

const PAGE_SIZE = 5;

const Error = Record({
    code: null,
    message: '',
    fatal: false,
    type: null
});

const initialState = fromJS({
    consecutiveQueryErrors: 0,
    currentPage: null,
    errors: new List(),
    flags: new Map(),
    query: '',
    resultsCount: null,
    searchService: null,
    showResults: false,
    totalPages: null,
});

const flagHandler = (state, { flags }) =>
    state.merge({
        errors: new List(),
        flags: state.get('flags').merge(flags)
    });

const queryErrorHandler = (state, { error, flags }) =>
    state.merge({
        consecutiveQueryErrors: state.get('consecutiveQueryErrors') >= 3 ?
            0 :
            state.get('consecutiveQueryErrors') + 1,
        errors: state.get('errors').push(new Error(error)),
        flags: state.get('flags').merge(flags)
    });

const searchState = createReducer(initialState, {
    [types.HANDSHAKE]: flagHandler,

    [types.HANDSHAKE_SUCCESS]: (state, { data, flags }) =>
        state.merge({
            consecutiveQueryErrors: 0,
            searchService: data.searchService,
            flags: state.get('flags').merge(flags)
        }),

    [types.HANDSHAKE_ERROR]: (state, { error, flags }) =>
        state.merge({
            errors: state.get('errors').push(new Error(error)),
            searchService: null,
            flags: state.get('flags').merge(flags)
        }),

    [types.QUERY]: (state, { query, flags }) =>
        state.merge({
            query,
            errors: new List(),
            flags: state.get('flags').merge(flags)
        }),

    [types.QUERY_SUCCESS]: (state, { data, flags }) =>
        state.merge({
            consecutiveQueryErrors: 0,
            currentPage: 1,
            totalPages: Math.ceil(data.total / PAGE_SIZE),
            resultsCount: data.total,
            showResults: true,
            flags: state.get('flags').merge(flags)
        }),

    [types.QUERY_ERROR]: queryErrorHandler,

    [types.MORE_QUERY]: flagHandler,

    [types.MORE_QUERY_SUCCESS]: (state, { data, flags }) =>
        state.merge({
            consecutiveQueryErrors: 0,
            currentPage: state.get('currentPage') + 1,
            totalPages: Math.ceil(data.total / PAGE_SIZE),
            resultsCount: data.total,
            flags: state.get('flags').merge(flags)
        }),

    [types.MORE_QUERY_ERROR]: queryErrorHandler,

    [types.RESET_RESULTS]: state =>
        state.merge({
            consecutiveQueryErrors: 0,
            currentPage: null,
            errors: new List(),
            query: '',
            totalPages: null,
            resultsCount: null,
            showResults: false
        }),
});

export default searchState;
