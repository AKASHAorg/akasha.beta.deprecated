import { createSelector } from 'reselect';
import { List } from 'immutable';

export const selectComment = (state, id) => state.commentsState.getIn(['byId', id]);

export const selectCommentIsPending = (state, context, commentId) =>
    state.commentsState.getIn(['flags', 'pendingComments', context, commentId]);

export const selectCommentLastBlock = (state, parent) => state.commentsState.getIn(['lastBlock', parent]);

export const selectCommentLastIndex = (state, parent) => state.commentsState.getIn(['lastIndex', parent]);

export const selectCommentVote = (state, commentId) => state.commentsState.getIn(['votes', commentId]);

export const selectEntryCommentsForParent = (state, entryId, parent) => {
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

export const selectHideCommentSettings = state =>
    state.settingsState.getIn(['userSettings', 'hideCommentContent']);

export const selectMoreComments = (state, parent) => state.commentsState.getIn(['moreComments', parent]);

export const selectPendingComments = (state, entryId) =>
    state.actionState.getIn(['pending', 'comment', entryId]) || new List();

export const selectPendingCommentVote = (state, commentId) =>
    state.actionState.getIn(['pending', 'commentVote', commentId]);

export const selectResolvingComment = (state, commentId) =>
    state.commentsState.getIn(['flags', 'resolvingComments', commentId]);
