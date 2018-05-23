import * as types from '../constants';
import { action } from './helpers';

export const commentsCheckNew = ({ entryId }) => action(types.COMMENTS_CHECK_NEW, { entryId });

export const commentsCheckNewError = (error) => {
    error.code = 'CCNE01';
    error.messageId = 'commentsCheckNew';
    return action(types.COMMENTS_CHECK_NEW_ERROR, { error });
};

export const commentsCheckNewSuccess = (data, request) =>
    action(types.COMMENTS_CHECK_NEW_SUCCESS, { data, request });
export const commentsClean = () => action(types.COMMENTS_CLEAN);
export const commentsDownvote = ({ actionId, commentId, entryId, weight }) =>
    action(types.COMMENTS_DOWNVOTE, { actionId, commentId, entryId, weight });

export const commentsDownvoteError = (error, request) => {
    error.code = 'CDE01';
    error.messageId = 'commentsDownvote';
    return action(types.COMMENTS_DOWNVOTE_ERROR, { error, request });
};

export const commentsDownvoteSuccess = data => action(types.COMMENTS_DOWNVOTE_SUCCESS, { data });

export const commentsGetComment = ({ context, entryId, commentId, author, parent, isParent }) =>
    action(types.COMMENTS_GET_COMMENT, { context, entryId, commentId, author, parent, isParent });

export const commentsGetCommentError = (error) => {
    error.code = 'CGCE01';
    error.messageId = 'commentsGetComment';
    return action(types.COMMENTS_GET_COMMENT_ERROR, { error });
};

export const commentsGetCommentSuccess = (data, request) =>
    action(types.COMMENTS_GET_COMMENT_SUCCESS, { data, request });

export const commentsGetCount = entryId => action(types.COMMENTS_GET_COUNT, { entryId });

export const commentsGetCountError = (error) => {
    error.code = 'CGCE01';
    error.messageId = 'commentsGetCount';
    return action(types.COMMENTS_GET_COUNT_ERROR, { error });
};

export const commentsGetCountSuccess = data => action(types.COMMENTS_GET_COUNT_SUCCESS, { data });
export const commentsGetScore = commentId => action(types.COMMENTS_GET_SCORE, { commentId });

export const commentsGetScoreError = (error) => {
    error.code = 'CGSE01';
    error.messageId = 'commentsGetScore';
    return action(types.COMMENTS_GET_SCORE_ERROR, { error });
};

export const commentsGetScoreSuccess = data => action(types.COMMENTS_GET_SCORE_SUCCESS, { data });
export const commentsGetVoteOf = data => action(types.COMMENTS_GET_VOTE_OF, { data });

export const commentsGetVoteOfError = (error) => {
    error.code = 'CGVOE01';
    error.messageId = 'commentsGetVoteOf';
    return action(types.COMMENTS_GET_VOTE_OF_ERROR, { error });
};

export const commentsGetVoteOfSuccess = data => action(types.COMMENTS_GET_VOTE_OF_SUCCESS, { data });
export const commentsIterator = ({ context, entryId, parent, more }) =>
    action(types.COMMENTS_ITERATOR, { context, entryId, parent, more });

export const commentsIteratorError = (error, request) => {
    error.code = 'CIE01';
    error.messageId = 'commentsIterator';
    return action(types.COMMENTS_ITERATOR_ERROR, { error, request });
};

export const commentsIteratorSuccess = (data, request) =>
    action(types.COMMENTS_ITERATOR_SUCCESS, { data, request });
export const commentsIteratorReversedSuccess = (data, request) =>
    action(types.COMMENTS_ITERATOR_REVERSED_SUCCESS, { data, request });
export const commentsLoadNew = () => action(types.COMMENTS_LOAD_NEW);
export const commentsMoreIterator = ({ entryId, parent }) =>
    action(types.COMMENTS_MORE_ITERATOR, { entryId, parent });

export const commentsMoreIteratorError = (error, request) => {
    error.code = 'CMIE01';
    error.messageId = 'commentsMoreIterator';
    return action(types.COMMENTS_MORE_ITERATOR_ERROR, { error, request });
};

export const commentsMoreIteratorSuccess = (data, request) =>
    action(types.COMMENTS_MORE_ITERATOR_SUCCESS, { data, request });
export const commentsPublish = ({ actionId, ...payload }) =>
    action(types.COMMENTS_PUBLISH, { actionId, ...payload });

export const commentsPublishError = (error) => {
    error.code = 'CPE01';
    error.messageId = 'commentsPublish';
    return action(types.COMMENTS_PUBLISH_ERROR, { error });
};

export const commentsPublishSuccess = data => action(types.COMMENTS_PUBLISH_SUCCESS, { data });
export const commentsResolveIpfsHash = (ipfsHashes, commentIds) =>
    action(types.COMMENTS_RESOLVE_IPFS_HASH, { ipfsHashes, commentIds });

export const commentsResolveIpfsHashError = (error) => {
    error.code = 'CRIHE01';
    error.messageId = 'commentsResolveIpfsHash';
    return action(types.COMMENTS_RESOLVE_IPFS_HASH_ERROR, { error });
};

export const commentsResolveIpfsHashSuccess = data =>
    action(types.COMMENTS_RESOLVE_IPFS_HASH_SUCCESS, { data });
export const commentsUpvote = ({ actionId, commentId, entryId, weight }) =>
    action(types.COMMENTS_UPVOTE, { actionId, commentId, entryId, weight });

export const commentsUpvoteError = (error, request) => {
    error.code = 'CDE01';
    error.messageId = 'commentsUpvote';
    return action(types.COMMENTS_UPVOTE_ERROR, { error, request });
};

export const commentsUpvoteSuccess = data => action(types.COMMENTS_UPVOTE_SUCCESS, { data });
