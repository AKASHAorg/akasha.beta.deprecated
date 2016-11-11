/* eslint new-cap: [2, {capIsNewExceptions: ["Record"]}] */
import { fromJS, List, Map, Record } from 'immutable';
import * as types from '../constants/TagConstants';
import { createReducer } from './create-reducer';

const ErrorRecord = Record({
    code: 0,
    fatal: false,
    message: ''
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

    [types.CREATE_PENDING_TAG_SUCCESS]: (state, { tag }) =>
        state.merge({
            pendingTags: state.get('pendingTags').push(tag)
        }),

    [types.CREATE_PENDING_TAG_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
        }),

    [types.UPDATE_PENDING_TAG_SUCCESS]: (state, { tag }) => {
        const index = state.get('pendingTags').findIndex(tagObj => tagObj.tag === tag.tag);
        return state.merge({
            pendingTags: state.get('pendingTags').mergeIn([index], tag)
        });
    },

    [types.UPDATE_PENDING_TAG_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
        }),

    [types.DELETE_PENDING_TAG_SUCCESS]: (state, { tag }) => {
        const index = state.get('pendingTags').findIndex(tagObj => tagObj.tag === tag);
        return state.merge({
            pendingTags: state.get('pendingTags').delete(index)
        });
    },

    [types.DELETE_PENDING_TAG_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
        }),

    [types.GET_PENDING_TAGS_SUCCESS]: (state, { data, flags }) =>
        state.merge({
            pendingTags: new List(data),
            flags: state.get('flags').merge(flags)
        }),

    [types.GET_PENDING_TAGS_ERROR]: (state, { error, flags }) =>
        state.merge({
            errors: state.get('errors').push(error),
            flags: state.get('flags').merge(flags)
        }),

    // [types.CREATE_TAG_SUCCESS]: (state, { data }) => {
    //     const pendingTagIndex = state.get('pendingTags').findIndex(tagObj => tagObj.tag === data.tag);
    //     console.log(pendingTagIndex, 'pendingTagIndex');
    //     return state.setIn(['pendingTags', pendingTagIndex, 'tx'], data.tx);
    //     // state.merge({
    //     //     pendingTags: state.get('pendingTags').setIn([pendingTagIndex, 'tx'], data.tx)
    //     // });
    // },

    [types.CREATE_TAG_ERROR]: (state, { error }) => {
        const tagName = error.from;
        const pendingTagIndex = state.get('pendingTags').findIndex(tagObj => tagObj.tag === tagName);
        return state.merge({
            pendingTags: state.get('pendingTags').mergeIn([pendingTagIndex], { error })
        });
    }
});

export default tagState;
