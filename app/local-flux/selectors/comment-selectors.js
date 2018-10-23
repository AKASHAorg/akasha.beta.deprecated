// @flow
import { createSelector } from 'reselect';
import { List } from 'immutable';

/*::
    type CommentByIdProps = {
        commentId: string
    }
    type CommentLastBlockProps = {
        parent: string
    }
    type CommentIsPendingProps = {
        context: string,
        commentId: string
    }
 */

export const selectCommentById = (state/*: Object */, props/*: CommentByIdProps */) =>
    state.commentsState.getIn(['byId', props.commentId]);

// @todo comment `context` param and avoid using confusing params
export const selectCommentIsPending = (state/*: Object */, props/*: CommentIsPendingProps */) =>
    state.commentsState.getIn(['flags', 'pendingComments', props.context, props.commentId]);

export const selectCommentLastBlock = (state/*: Object */, props/*: CommentLastBlockProps */) =>
    state.commentsState.getIn(['lastBlock', props.parent]);

export const selectCommentLastIndex = (state/*: Object */, props/*: CommentLastBlockProps */) =>
    state.commentsState.getIn(['lastIndex', props.parent]);

export const selectCommentVote = (state/*: Object */, props/*: CommentByIdProps */) =>
    state.commentsState.getIn(['votes', props.commentId]);

// @todo ---------------------- Refactor below --------------------------- 
export const selectEntryCommentsForParent = (state/*: Object */, entryId, parent) => {
    const list = state.commentsState.getIn(['byParent', parent]) || new List();
    return list.map(id => selectComment(state, id)).filter(comm => comm.entryId === entryId);
};

export const selectCommentsFlag = (state, flag, id) => {
    if (id) {
        return state.commentsState.getIn(['flags', flag, id]);
    }
    return state.commentsState.getIn(['flags', flag]);
};

export const selectNewCommentsBlock = state =>
    state.commentsState.getIn(['newComments', 'lastBlock']) || selectBlockNumber(state);

export const selectNewestCommentBlock = (state, parent) =>
    state.commentsState.getIn(['newestCommentBlock', parent]);

export const selectFirstComment = state => state.commentsState.get('firstComm');

export const selectMoreComments = (state, parent) => state.commentsState.getIn(['moreComments', parent]);

export const selectPendingComments = (state, entryId) =>
    state.actionState.getIn(['pending', 'comment', entryId]) || new List();

export const selectPendingCommentVote = (state, commentId) =>
    state.actionState.getIn(['pending', 'commentVote', commentId]);

export const selectResolvingComment = (state, commentId) =>
    state.commentsState.getIn(['flags', 'resolvingComments', commentId]);
