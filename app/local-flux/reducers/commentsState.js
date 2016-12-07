/* eslint new-cap: ["error", { "capIsNewExceptions": ["Record", "Map"] }]*/
import { fromJS, Map, Record, List } from 'immutable';
import * as types from '../constants/CommentsConstants';
import { createReducer } from './create-reducer';

const ErrorRecord = Record({
    code: '',
    message: null,
    fatal: false
});

const initialState = fromJS({
    entryComments: new List(),
    flags: new Map(),
    errors: new List()
});

const flagsHandler = (state, { flags }) =>
    state.merge({
        flags: state.get('flags').merge(flags)
    });

const errorHandler = (state, { error, flags }) =>
    state.merge({
        errors: state.get('errors').push(new ErrorRecord(error)),
        flags: state.get('flags').merge(flags)
    });

const commentsState = createReducer(initialState, {
    [types.GET_ENTRY_COMMENTS]: flagsHandler,
    [types.GET_ENTRY_COMMENTS_ERROR]: errorHandler,
    [types.GET_ENTRY_COMMENTS_SUCCESS]: (state, { data, flags }) => {
        console.log(data, 'comments fetched and ready to be stored!');
        return state;
    }
});

export default commentsState;

