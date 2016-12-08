/* eslint new-cap: ["error", { "capIsNewExceptions": ["Record", "Map"] }]*/
import { fromJS, Map, Record, List } from 'immutable';
import * as types from '../constants/CommentsConstants';
import { createReducer } from './create-reducer';

const ErrorRecord = Record({
    code: '',
    message: null,
    fatal: false
});
const CommentData = Record({
    active: null,
    parent: null,
    profile: new Map(),
    content: null,
    date: new Date(),
    ipfsHash: null,
});
const Comment = Record({
    entryId: null,
    data: new CommentData(),
    commentId: null,
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
const castCommentToRecord = (commentObj) => {
    const { commentId, data, entryId } = commentObj;
    const { active, content, date, ipfsHash, parent, profile } = data;
    console.log('casting', commentObj);
    return new Comment({
        entryId,
        commentId: parseInt(commentId, 10),
        data: new CommentData({
            active,
            content,
            date,
            ipfsHash,
            parent,
            profile: new Map(profile)
        })
    });
};
const commentsState = createReducer(initialState, {
    [types.GET_ENTRY_COMMENTS]: flagsHandler,
    [types.GET_ENTRY_COMMENTS_ERROR]: errorHandler,
    [types.GET_ENTRY_COMMENTS_SUCCESS]: (state, { comments, flags }) => {
        const comms = comments.collection.map(comment =>
            castCommentToRecord(comment)
        );
        return state.merge({
            entryComments: state.get('entryComments').concat(new List(comms)),
            flags: state.get('flags').merge(flags)
        });
    },
    [types.PUBLISH_COMMENT_OPTIMISTIC]: (state, { comment }) =>
        state.merge({
            entryComments: state.get('entryComments').push(castCommentToRecord(comment))
        }),
    [types.PUBLISH_COMMENT_SUCCESS]: (state, { data, flags }) => {
        console.log(data, 'published comment');
        const index = state.get('entryComments').findIndex(comm =>
            comm.get('entryId') === data.entryId && comm.get('commentId') === 'temp'
        );
        console.log('update comment with index %s in list', index);
        return state;
    }

});

export default commentsState;

