// @flow
import { createSelector } from 'reselect';
import { List } from 'immutable';
import { getCurrentBlockNumber } from './external-process-selectors';

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
    type EntryCommentsByParentProps = {
        parent: string,
        entryId: string
    }
    type CommentsFlagProps = {
        commentId?: string,
        flag: string
    }
    type NewestCommentBlockProps = {
        parent: string
    }
    type MoreCommentsProps = {
        parent: string
    }
    type ResolvingCommentProps = {
        commentId: string
    }
 */

export const selectCommentById = (state/*: Object */, props/*: CommentByIdProps */) =>
    state.commentsState.getIn(['byId', props.commentId]);

export const selectEntryCommentsByParent = (state/*: Object */, props/*: EntryCommentsByParentProps */) =>
    state.commentsState.getIn(['byParent', props.parent]).filter(comm => comm.entryId === props.entryId);

export const selectCommentsFlags = (state/*: Object */) => state.commentsState.get('flags');

// @todo comment `context` param and avoid using confusing params
export const selectCommentIsPending = (state/*: Object */, props/*: CommentIsPendingProps */) =>
    state.commentsState.getIn(['flags', 'pendingComments', props.context, props.commentId]);

export const selectCommentLastBlock = (state/*: Object */, props/*: CommentLastBlockProps */) =>
    state.commentsState.getIn(['lastBlock', props.parent]);

export const selectCommentLastIndex = (state/*: Object */, props/*: CommentLastBlockProps */) =>
    state.commentsState.getIn(['lastIndex', props.parent]);

export const selectCommentVote = (state/*: Object */, props/*: CommentByIdProps */) =>
    state.commentsState.getIn(['votes', props.commentId]);
export const selectNewCommentsBlock = (state/*: Object */) =>
    state.commentsState.getIn(['newComments', 'lastBlock']) || getCurrentBlockNumber(state);

export const selectNewestCommentBlock = (state/*: Object */, props/*: NewestCommentBlockProps */) =>
    state.commentsState.getIn(['newestCommentBlock', props.parent]);

export const selectFirstComment = (state/*: Object */) => state.commentsState.get('firstComm');

export const selectMoreComments = (state/*: Object */, props/*: MoreCommentsProps */) =>
    state.commentsState.getIn(['moreComments', props.parent]);

export const selectResolvingComment = (state/*: Object */, props/*: ResolvingCommentProps */) =>
    selectCommentsFlags(state).get(['resolvingComments', props.commentId]);



export const getEntryCommentsByParent = createSelector(
    [selectEntryCommentsByParent, state => state],
    (commentsList, state) => {
        if(!commentsList) {
            return new List();
        }
        return commentsList
            .map(id => selectCommentById(state, id));
    }
)

export const getCommentsFlag = (state/*: Object */, props/*: CommentsFlagProps */) => {
    if(props.commentId) {
        return selectCommentsFlags(state).getIn([props.flag, props.commentId]);
    }
    return selectCommentsFlags(state).getIn([props.flag]);
}
