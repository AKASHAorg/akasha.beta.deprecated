import * as types from '../constants';
import { action } from './helpers';

export const commentsCheckNew = entryId => action(types.COMMENTS_CHECK_NEW, { entryId });

export const commentsCheckNewError = (error) => {
    error.code = 'CCNE01';
    error.messageId = 'commentsCheckNew';
    return action(types.COMMENTS_CHECK_NEW_ERROR, { error });
};

export const commentsCheckNewSuccess = data => action(types.COMMENTS_CHECK_NEW_SUCCESS, { data });
export const commentsClean = () => action(types.COMMENTS_CLEAN);
export const commentsGetCount = entryId => action(types.COMMENTS_GET_COUNT, { entryId });

export const commentsGetCountError = (error) => {
    error.code = 'CGCE01';
    error.messageId = 'commentsGetCount';
    return action(types.COMMENTS_GET_COUNT_ERROR, { error });
};

export const commentsGetCountSuccess = data => action(types.COMMENTS_GET_COUNT_SUCCESS, { data });
export const commentsIterator = ({ entryId, parent, more }) =>
    action(types.COMMENTS_ITERATOR, { entryId, parent, more });

export const commentsIteratorError = (error, request) => {
    error.code = 'CIE01';
    error.messageId = 'commentsIterator';
    return action(types.COMMENTS_ITERATOR_ERROR, { error, request });
};

export const commentsIteratorSuccess = (data, request) =>
    action(types.COMMENTS_ITERATOR_SUCCESS, { data, request });
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
