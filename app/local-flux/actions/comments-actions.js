//@flow
import * as types from '../constants';
import { action } from './helpers';
import { COMMENTS_MODULE } from '@akashaproject/common/constants';

/*::
    import type { CommentsCheckNewPayload } from '../../flow-typed/actions/comments-actions';
*/

export const commentsCheckNew = (payload /* : CommentsCheckNewPayload */) =>
    action(types.COMMENTS_CHECK_NEW, payload);

export const commentsCheckNewError = error => {
    error.code = 'CCNE01';
    error.messageId = 'commentsCheckNew';
    return action(types.COMMENTS_CHECK_NEW_ERROR, { error });
};

export const commentsCheckNewSuccess = (data, request) =>
    action(types.COMMENTS_CHECK_NEW_SUCCESS, { data, request });

export const commentsClean = () => action(types.COMMENTS_CLEAN);

export const commentsDownvote = ({ actionId, commentId, entryId, weight }) =>
    action(`${COMMENTS_MODULE.downVote}`, { actionId, commentId, entryId, weight });

export const commentsGetComment = ({ context, entryId, commentId, author, parent, isParent }) =>
    action(`${COMMENTS_MODULE.getComment}`, { context, entryId, commentId, author, parent, isParent });

export const commentsGetCount = entryId => action(`${COMMENTS_MODULE.commentsCount}`, { entryId });

export const commentsGetScore = commentId => action(`${COMMENTS_MODULE.getScore}`, { commentId });

export const commentsGetVoteOf = data => action(`${COMMENTS_MODULE.getVoteOf}`, { data });

export const commentsIterator = ({ context, entryId, parent, more }) =>
    action(`${COMMENTS_MODULE.commentsIterator}`, { context, entryId, parent, more });

// export const commentsIteratorReversedSuccess = (data, request) =>
//     action(types.COMMENTS_ITERATOR_REVERSED_SUCCESS, { data, request });
export const commentsLoadNew = () => action(types.COMMENTS_LOAD_NEW);
export const commentsMoreIterator = ({ entryId, parent }) =>
    action(types.COMMENTS_MORE_ITERATOR, { entryId, parent });
// export const commentsMoreIteratorError = (error, request) => {
//     error.code = 'CMIE01';
//     error.messageId = 'commentsMoreIterator';
//     return action(types.COMMENTS_MORE_ITERATOR_ERROR, { error, request });
// };
// export const commentsMoreIteratorSuccess = (data, request) =>
//     action(types.COMMENTS_MORE_ITERATOR_SUCCESS, { data, request });

export const commentsPublish = ({ actionId, ...payload }) =>
    action(`${COMMENTS_MODULE.comment}`, { actionId, ...payload });

export const commentsResolveIpfsHash = (ipfsHashes, commentIds) =>
    action(`${COMMENTS_MODULE.resolveCommentsIpfsHash}`, { ipfsHashes, commentIds });

export const commentsUpvote = ({ actionId, commentId, entryId, weight }) =>
    action(`${COMMENTS_MODULE.upvote}`, { actionId, commentId, entryId, weight });
