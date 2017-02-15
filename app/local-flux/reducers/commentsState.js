/* eslint new-cap: ["error", { "capIsNewExceptions": ["Record", "Map"] }]*/
import { fromJS, Map, Record, List, Set } from 'immutable';
import * as types from '../constants/CommentsConstants';
import * as appTypes from '../constants/AppConstants';
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
    date: null,
    ipfsHash: null,
});
const Comment = Record({
    entryId: null,
    data: new CommentData(),
    commentId: null,
    tempTx: null,
    isPublishing: false
});

const initialState = fromJS({
    entryComments: new List(),
    newCommentsIds: new Set(),
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
    const { commentId, data, entryId, tempTx, isPublishing } = commentObj;
    const { active, content, date, ipfsHash, parent, profile } = data;
    return new Comment({
        entryId: parseInt(entryId, 10),
        commentId: (commentId !== 'temp') ? parseInt(commentId, 10) : null,
        tempTx,
        isPublishing,
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
    [types.GET_ENTRY_COMMENTS_SUCCESS]: (state, { comments, options, flags }) => {
        const { reverse, entryId } = options;
        const comms = comments.collection.map((comment) => {
            comment.data.profile.avatar = `${comment.data.profile.baseUrl}/${comment.data.profile.avatar}`;
            return castCommentToRecord(comment);
        });
        if (reverse) {
            const newState = state.setIn(['entryComments'],
                state.get('entryComments')
                     .filter(comm => (comm.get('entryId') === entryId && comm.get('commentId') && !comm.get('tempTx')))
                     .toStack()
                     .unshift(...comms.reverse())
                     .toList());
            return newState.merge({
                flags: state.get('flags').merge(flags)
            });
        }
        return state.merge({
            entryComments: state.get('entryComments').concat(new List(comms)),
            flags: state.get('flags').merge(flags)
        });
    },

    [types.FETCH_NEW_COMMENTS_SUCCESS]: (state, { comment, options }) => {
        const comms = castCommentToRecord(comment);
        const newState = state.setIn(['entryComments'],
            state.get('entryComments')
                 .filter(comm => (comm.get('entryId') === parseInt(comment.entryId, 10) && comm.get('commentId') && !comm.get('tempTx')))
                 .toStack()
                 .unshift(comms)
                 .toList()
        );
        if (!options || (options && !options.autoload)) {
            return newState.setIn(['newCommentsIds'], state.get('newCommentsIds').union([comment.commentId]));
        }
        return newState;
    },

    [types.CLEAR_NEW_COMMENTS_IDS_SUCCESS]: state =>
        state.setIn(['newCommentsIds'], state.get('newCommentsIds').clear()),

    [types.PUBLISH_COMMENT_OPTIMISTIC]: (state, { comment }) => {
        comment.data.date = new Date().toISOString();
        comment.isPublishing = true;
        const imComment = castCommentToRecord(comment);
        const entryComments = state.get('entryComments').insert(0, imComment);
        return state.set('entryComments', entryComments);
    },

    [types.PUBLISH_COMMENT_SUCCESS]: (state, { data }) => {
        const index = state.get('entryComments').findIndex(comm =>
            comm.get('tempTx') && (comm.get('tempTx') === data.registerPending.tx.tx)
        );
        if (index === -1) {
            return state;
        }
        return state.merge({
            entryComments: state.get('entryComments').setIn([index, 'isPublishing'], false)
        });
    },
    [types.UNLOAD_COMMENTS]: (state, { entryId, commentId }) =>
        state.set('entryComments',
            state.get('entryComments').filter((comment) => {
                if (commentId === null) {
                    return ((comment.get('entryId') !== entryId) && (comment.get('commentId') !== commentId));
                }
                return comment.get('entryId') !== entryId;
            })
        ),

    [appTypes.CLEAN_STORE]: () => initialState,
});

export default commentsState;

