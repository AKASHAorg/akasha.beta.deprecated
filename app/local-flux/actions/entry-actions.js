import { action } from './helpers';
import * as types from '../constants';

export const entryAddClaimAction = payload => action(types.ENTRY_ADD_CLAIM_ACTION, { payload });
export const entryAddDownvoteAction = payload =>
    action(types.ENTRY_ADD_DOWNVOTE_ACTION, { payload });
export const entryAddUpvoteAction = payload => action(types.ENTRY_ADD_UPVOTE_ACTION, { payload });
export const entryCanClaim = entryId => action(types.ENTRY_CAN_CLAIM, { entryId });

export const entryCanClaimError = (error) => {
    error.code = 'ECCE01';
    error.messageId = 'entryCanClaim';
    return action(types.ENTRY_CAN_CLAIM_ERROR, { error });
};

export const entryCanClaimSuccess = data => action(types.ENTRY_CAN_CLAIM_SUCCESS, { data });
export const entryClaim = (entryId, entryTitle, gas) =>
    action(types.ENTRY_CLAIM, { entryId, entryTitle, gas });

export const entryClaimError = (error, entryId, entryTitle) => {
    error.code = 'ECE01';
    error.messageId = 'entryClaim';
    error.values = { entryTitle };
    return action(types.ENTRY_CLAIM_ERROR, { error, entryId });
};

export const entryClaimSuccess = data => action(types.ENTRY_CLAIM_SUCCESS, { data });
export const entryCleanFull = () => action(types.ENTRY_CLEAN_FULL);
export const entryDownvote = (entryId, entryTitle, weight, value, gas) =>
    action(types.ENTRY_DOWNVOTE, { entryId, entryTitle, weight, value, gas });

export const entryDownvoteError = (error, entryId, entryTitle) => {
    error.code = 'EDE01';
    error.messageId = 'entryDownvote';
    error.values = { entryTitle };
    return action(types.ENTRY_DOWNVOTE_ERROR, { error, entryId });
};

export const entryDownvoteSuccess = data =>
    action(types.ENTRY_DOWNVOTE_SUCCESS, { data });
export const entryGetBalance = entryId => action(types.ENTRY_GET_BALANCE, { entryId });

export const entryGetBalanceError = (error) => {
    error.code = 'EGBE01';
    error.messageId = 'entryGetBalance';
    return action(types.ENTRY_GET_BALANCE_ERROR, { error });
};

export const entryGetBalanceSuccess = data => action(types.ENTRY_GET_BALANCE_SUCCESS, { data });
export const entryGetFull = (entryId, version) =>
    action(types.ENTRY_GET_FULL, { entryId, version });

export const entryGetFullError = (error) => {
    error.code = 'EGFE01';
    error.messageId = 'entryGetFull';
    return action(types.ENTRY_GET_FULL_ERROR, { error });
};

export const entryGetFullSuccess = data => action(types.ENTRY_GET_FULL_SUCCESS, { data });
export const entryGetLatestVersion = entryId => action(types.ENTRY_GET_LATEST_VERSION, { entryId });

export const entryGetLatestVersionError = (error) => {
    error.code = 'EGLVE01';
    error.messageId = 'entryGetLatestVersion';
    action(types.ENTRY_GET_LATEST_VERSION_ERROR, { error });
};

export const entryGetLatestVersionSuccess = data =>
    action(types.ENTRY_GET_LATEST_VERSION_SUCCESS, { data });
export const entryGetScore = entryId => action(types.ENTRY_GET_SCORE, { entryId });

export const entryGetScoreError = (error) => {
    error.code = 'EGSE01';
    error.messageId = 'entryGetError';
    return action(types.ENTRY_GET_SCORE_ERROR, { error });
};

export const entryGetScoreSuccess = data => action(types.ENTRY_GET_SCORE_SUCCESS, { data });
export const entryGetVoteOf = entryId => action(types.ENTRY_GET_VOTE_OF, { entryId });

export const entryGetVoteOfError = (error) => {
    error.code = 'EGVOE01';
    error.messageId = 'entryGetVoteOf';
    return action(types.ENTRY_GET_VOTE_OF_ERROR, { error });
};

export const entryGetVoteOfSuccess = data => action(types.ENTRY_GET_VOTE_OF_SUCCESS, { data });
export const entryIsActive = entryId => action(types.ENTRY_IS_ACTIVE, { entryId });

export const entryIsActiveError = (error) => {
    error.code = 'EIAE01';
    error.messageId = 'entryIsActive';
    return action(types.ENTRY_IS_ACTIVE_ERROR, { error });
};

export const entryIsActiveSuccess = data => action(types.ENTRY_IS_ACTIVE_SUCCESS, { data });
export const entryMoreNewestIterator = columnId => action(types.ENTRY_MORE_NEWEST_ITERATOR, { columnId });

export const entryMoreNewestIteratorError = (error, req) => {
    error.code = 'EMNIE01';
    error.messageId = 'entryMoreNewestIterator';
    return action(types.ENTRY_MORE_NEWEST_ITERATOR_ERROR, { error, req });
};

export const entryMoreNewestIteratorSuccess = (data, req) =>
    action(types.ENTRY_MORE_NEWEST_ITERATOR_SUCCESS, { data, req });
export const entryMoreProfileIterator = (columnId, akashaId) =>
    action(types.ENTRY_MORE_PROFILE_ITERATOR, { columnId, akashaId });

export const entryMoreProfileIteratorError = (error, req) => {
    error.code = 'EMPIE01';
    error.messageId = 'entryMoreProfileIterator';
    return action(types.ENTRY_MORE_PROFILE_ITERATOR_ERROR, { error, req });
};

export const entryMoreProfileIteratorSuccess = (data, req) =>
    action(types.ENTRY_MORE_PROFILE_ITERATOR_SUCCESS, { data, req });
export const entryMoreStreamIterator = columnId => action(types.ENTRY_MORE_STREAM_ITERATOR, { columnId });

export const entryMoreStreamIteratorError = (error, req) => {
    error.code = 'EMSIE01';
    error.messageId = 'entryMoreStreamIterator';
    return action(types.ENTRY_MORE_STREAM_ITERATOR_ERROR, { error, req });
};

export const entryMoreStreamIteratorSuccess = (data, req) =>
    action(types.ENTRY_MORE_STREAM_ITERATOR_SUCCESS, { data, req });
export const entryMoreTagIterator = (columnId, tagName) =>
    action(types.ENTRY_MORE_TAG_ITERATOR, { columnId, tagName });

export const entryMoreTagIteratorError = (error, req) => {
    error.code = 'EMTIE01';
    error.messageId = 'entryMoreTagIterator';
    return action(types.ENTRY_MORE_TAG_ITERATOR_ERROR, { error, req });
};

export const entryMoreTagIteratorSuccess = (data, req) =>
    action(types.ENTRY_MORE_TAG_ITERATOR_SUCCESS, { data, req });
export const entryNewestIterator = columnId => action(types.ENTRY_NEWEST_ITERATOR, { columnId });

export const entryNewestIteratorError = (error, req) => {
    error.code = 'ENIE01';
    error.messageId = 'entryNewestIterator';
    return action(types.ENTRY_NEWEST_ITERATOR_ERROR, { error, req });
};

export const entryNewestIteratorSuccess = (data, req) =>
    action(types.ENTRY_NEWEST_ITERATOR_SUCCESS, { data, req });
export const entryPageHide = () => action(types.ENTRY_PAGE_HIDE);
export const entryPageShow = (entryId, version) =>
    action(types.ENTRY_PAGE_SHOW, { entryId, version });
export const entryProfileIterator = (columnId, akashaId) =>
    action(types.ENTRY_PROFILE_ITERATOR, { columnId, akashaId });

export const entryProfileIteratorError = (error, req) => {
    error.code = 'EPIE01';
    error.messageId = 'entryProfileIterator';
    return action(types.ENTRY_PROFILE_ITERATOR_ERROR, { error, req });
};

export const entryProfileIteratorSuccess = (data, req) =>
    action(types.ENTRY_PROFILE_ITERATOR_SUCCESS, { data, req });
export const entryResolveIpfsHash = (ipfsHash, columnId, entryIds) =>
    action(types.ENTRY_RESOLVE_IPFS_HASH, { ipfsHash, columnId, entryIds });

export const entryResolveIpfsHashError = (error, req) => {
    error.code = 'ERIHE01';
    error.messageId = 'entryResolveIpfsHash';
    return action(types.ENTRY_RESOLVE_IPFS_HASH_ERROR, { error, req });
};

export const entryResolveIpfsHashSuccess = (data, req) =>
    action(types.ENTRY_RESOLVE_IPFS_HASH_SUCCESS, { data, req });
export const entryStreamIterator = columnId => action(types.ENTRY_STREAM_ITERATOR, { columnId });

export const entryStreamIteratorError = (error, req) => {
    error.code = 'ESIE01';
    error.messageId = 'entryStreamIterator';
    return action(types.ENTRY_STREAM_ITERATOR_ERROR, { error, req });
};

export const entryStreamIteratorSuccess = (data, req) =>
    action(types.ENTRY_STREAM_ITERATOR_SUCCESS, { data, req });
export const entryTagIterator = (columnId, tagName) =>
    action(types.ENTRY_TAG_ITERATOR, { columnId, tagName });

export const entryTagIteratorError = (error, req) => {
    error.code = 'ETIE01';
    error.messageId = 'entryTagIterator';
    return action(types.ENTRY_TAG_ITERATOR_ERROR, { error, req });
};

export const entryTagIteratorSuccess = (data, req) =>
    action(types.ENTRY_TAG_ITERATOR_SUCCESS, { data, req });
export const entryUpvote = (entryId, entryTitle, weight, value, gas) =>
    action(types.ENTRY_UPVOTE, { entryId, entryTitle, weight, value, gas });

export const entryUpvoteError = (error, entryId, entryTitle) => {
    error.code = 'EUE01';
    error.messageId = 'entryUpvote';
    error.values = { entryTitle };
    return action(types.ENTRY_UPVOTE_ERROR, { error, entryId });
};

export const entryUpvoteSuccess = data =>
    action(types.ENTRY_UPVOTE_SUCCESS, { data });
export const entryVoteCost = () => action(types.ENTRY_VOTE_COST);

export const entryVoteCostError = (error) => {
    error.code = 'EVCE01';
    error.messageId = 'entryVoteCost';
    return action(types.ENTRY_VOTE_COST_ERROR, { error });
};

export const entryVoteCostSuccess = data => action(types.ENTRY_VOTE_COST_SUCCESS, { data });
