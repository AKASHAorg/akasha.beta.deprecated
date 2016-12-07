/* eslint new-cap: ["error", { "capIsNewExceptions": ["Record", "Map"] }]*/
import { fromJS, Map, Record, List } from 'immutable';
import * as types from '../constants/CommentsConstants';
import { createReducer } from './create-reducer';

const ErrorRecord = Record({
    code: '',
    message: null,
    fatal: false
});

const Comment = Record({
    entryId: null,
    commentId: null,
    active: null,
    parent: null,
    profile: null
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
        console.log(data, 'comments fetched! Please REVIEW THE CASTING TO RECORD!!');
        const comments = data.collection.map((comment) => {
            const entryId = data.entryId;
            const { commentId, content } = comment;
            const { active, parent, profile } = content;
            return new Comment({
                entryId,
                commentId: parseInt(commentId, 10),
                active,
                parent,
                profile,
            });
        });
        return state.merge({
            entryComments: state.get('entryComments').concat(new List(comments)),
            flags: state.get('flags').merge(flags)
        });
    }
});

export default commentsState;

