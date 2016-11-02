/* eslint new-cap: [2, {capIsNewExceptions: ["Record"]}] */
import { fromJS, List, Map, Record } from 'immutable';
import * as types from '../constants/TagConstants';
import { createReducer } from './create-reducer';

const ErrorRecord = Record({
    code: 0,
    fatal: false,
    message: ''
});

const PendingTag = Record({
    tx: null,
    tag: null
});
const initialState = fromJS({
    tagsCount: 0,
    pendingTags: new List(),
    errors: new List(),
    flags: new Map(),
    isLoading: false
});

const tagState = createReducer(initialState, {
    [types.GET_PENDING_TAGS]: (state, { flags }) =>
        state.merge({
            flags: state.get('flags').merge(flags)
        }),

    [types.GET_PENDING_TAGS_SUCCESS]: (state, { data, flags }) =>
        state.merge({
            pendingTags: state.get('pendingTags').push(data),
            flags: state.get('flags').merge(flags)
        }),

    [types.GET_PENDING_TAGS_ERROR]: (state, { error, flags }) =>
        state.merge({
            errors: state.get('errors').push(error),
            flags: state.get('flags').merge(flags)
        }),
    [types.SAVE_PENDING_TAG_SUCCESS]: (state, { data }) =>
        state.merge({
            pendingTags: state.get('pendingTags').push(new PendingTag(data))
        }),
    [types.SAVE_PENDING_TAG_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
        }),
    // [types.GET_TAGS]: state =>
    //     state.merge({
    //         isLoading: true,
    //     }),
    // [types.GET_TAGS_SUCCESS]: (state, action) =>
    //     state.merge({
    //         tagsCount: state.get('tagsCount') + action.tags.length,
    //         isLoading: false
    //     }),
    // [types.GET_TAGS_ERROR]: (state, action) => {
    //     return state;
    // },
});

export default tagState;
