import { action } from './helpers';
import * as types from '../constants';

export const entryCanClaim = entryIds => action(types.ENTRY_CAN_CLAIM, { entryIds });
export const entryCanClaimError = (error) => {
    error.code = 'ECCE01';
    error.messageId = 'entryCanClaim';
    return action(types.ENTRY_CAN_CLAIM_ERROR, { error });
};
export const entryCanClaimSuccess = data => action(types.ENTRY_CAN_CLAIM_SUCCESS, { data });

export const entryCanClaimVote = entryIds => action(types.ENTRY_CAN_CLAIM_VOTE, { entryIds });
export const entryCanClaimVoteError = (error) => {
    error.code = 'ECCVE01';
    error.messageId = 'entryCanClaimVote';
    return action(types.ENTRY_CAN_CLAIM_VOTE_ERROR, { error });
};
export const entryCanClaimVoteSuccess = data => action(types.ENTRY_CAN_CLAIM_VOTE_SUCCESS, { data });

export const entryClaim = ({ actionId, entryId, entryTitle }) =>
    action(types.ENTRY_CLAIM, { actionId, entryId, entryTitle });
export const entryClaimError = (error, entryId, entryTitle) => {
    error.code = 'ECE01';
    error.messageId = 'entryClaim';
    error.values = { entryTitle };
    return action(types.ENTRY_CLAIM_ERROR, { error, entryId });
};
export const entryClaimSuccess = data => action(types.ENTRY_CLAIM_SUCCESS, { data });

export const entryClaimVote = ({ actionId, entryId, entryTitle }) =>
    action(types.ENTRY_CLAIM_VOTE, { actionId, entryId, entryTitle });
export const entryClaimVoteError = (error, request) => {
    error.code = 'ECVE01';
    error.messageId = 'entryClaimVote';
    error.values = { entryTitle: request.entryTitle };
    return action(types.ENTRY_CLAIM_ERROR, { error, request });
};
export const entryClaimVoteSuccess = data => action(types.ENTRY_CLAIM_VOTE_SUCCESS, { data });

export const entryCleanFull = () => action(types.ENTRY_CLEAN_FULL);

export const entryDownvote = ({ actionId, entryId, entryTitle, ethAddress, weight, value }) =>
    action(types.ENTRY_DOWNVOTE, { actionId, entryId, entryTitle, ethAddress, weight, value });

export const entryDownvoteError = (error, entryId, entryTitle) => {
    error.code = 'EDE01';
    error.messageId = 'entryDownvote';
    error.values = { entryTitle };
    return action(types.ENTRY_DOWNVOTE_ERROR, { error, entryId });
};
export const entryDownvoteSuccess = data =>
    action(types.ENTRY_DOWNVOTE_SUCCESS, { data });

export const entryGetBalance = entryIds => action(types.ENTRY_GET_BALANCE, { entryIds });
export const entryGetBalanceError = (error) => {
    error.code = 'EGBE01';
    error.messageId = 'entryGetBalance';
    return action(types.ENTRY_GET_BALANCE_ERROR, { error });
};
export const entryGetBalanceSuccess = data => action(types.ENTRY_GET_BALANCE_SUCCESS, { data });

export const entryGetEndPeriod = entryIds => action(types.ENTRY_GET_END_PERIOD, { entryIds });
export const entryGetEndPeriodError = (error) => {
    error.code = 'EGEPE01';
    error.messageId = 'entryGetEndPeriod';
    return action(types.ENTRY_GET_END_PERIOD_ERROR, { error });
};
export const entryGetEndPeriodSuccess = data => action(types.ENTRY_GET_END_PERIOD_SUCCESS, { data });

export const entryGetFull = ({
    akashaId, entryId, ethAddress, version, asDraft,
    revert, publishedDateOnly, latestVersion
}) =>
    action(types.ENTRY_GET_FULL, {
        akashaId, entryId, ethAddress, version, asDraft, revert, publishedDateOnly, latestVersion
    });
export const entryGetFullError = (error) => {
    error.code = 'EGFE01';
    error.messageId = 'entryGetFull';
    return action(types.ENTRY_GET_FULL_ERROR, { error });
};
export const entryGetFullSuccess = (data, request) => action(types.ENTRY_GET_FULL_SUCCESS, { data, request });

export const entryGetFullAsDraft = data => action(types.ENTRY_GET_FULL_AS_DRAFT, { data });
export const entryGetFullAsDraftError = error => action(types.ENTRY_GET_FULL_AS_DRAFT_ERROR, { error });
export const entryGetFullAsDraftSuccess = data => action(types.ENTRY_GET_FULL_AS_DRAFT_SUCCESS, { data });

export const entryGetVersionPublishedDateSuccess = (data, req) =>
    action(types.ENTRY_GET_VERSION_PUBLISHED_DATE_SUCCESS, { data, req });

export const entryGetVersionPublishedDateError = error =>
    action(types.ENTRY_GET_VERSION_PUBLISHED_DATE_ERROR, { error });

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
    error.messageId = 'entryGetScore';
    return action(types.ENTRY_GET_SCORE_ERROR, { error });
};
export const entryGetScoreSuccess = data => action(types.ENTRY_GET_SCORE_SUCCESS, { data });
export const entryGetShort = ({ context, entryId, ethAddress, batching }) =>
    action(types.ENTRY_GET_SHORT, { context, entryId, ethAddress, batching });

export const entryGetShortError = (error, request) => {
    error.code = 'EGSE02';
    error.messageId = 'entryGetShort';
    return action(types.ENTRY_GET_SHORT_ERROR, { error, request, batching: request.batching });
};

export const entryGetShortSuccess = (data, request) =>
    action(types.ENTRY_GET_SHORT_SUCCESS, { data, request, batching: request.batching });
export const entryGetVoteOf = entryIds => action(types.ENTRY_GET_VOTE_OF, { entryIds });

export const entryGetVoteOfError = (error) => {
    error.code = 'EGVOE01';
    error.messageId = 'entryGetVoteOf';
    return action(types.ENTRY_GET_VOTE_OF_ERROR, { error });
};

export const entryGetVoteOfSuccess = data => action(types.ENTRY_GET_VOTE_OF_SUCCESS, { data });

export const entryGetVoteRatio = data => action(types.ENTRY_GET_VOTE_RATIO, { data });
export const entryGetVoteRatioSuccess = data => action(types.ENTRY_GET_VOTE_RATIO_SUCCESS, { data });
export const entryGetVoteRatioError = error => action(types.ENTRY_GET_VOTE_RATIO_ERROR, { error });

export const entryListIterator = column =>
    action(types.ENTRY_LIST_ITERATOR, { column });
export const entryListIteratorSuccess = (data, request) =>
    action(types.ENTRY_LIST_ITERATOR_SUCCESS, { data, request });

export const entryMoreListIterator = column =>
    action(types.ENTRY_MORE_LIST_ITERATOR, { column });
export const entryMoreListIteratorSuccess = (data, request) =>
    action(types.ENTRY_MORE_LIST_ITERATOR_SUCCESS, { data, request });

export const entryMoreNewestIterator = column => action(types.ENTRY_MORE_NEWEST_ITERATOR, { column });
export const entryMoreNewestIteratorError = (error, request) => {
    error.code = 'EMNIE01';
    error.messageId = 'entryMoreNewestIterator';
    return action(types.ENTRY_MORE_NEWEST_ITERATOR_ERROR, { error, request });
};
export const entryMoreNewestIteratorSuccess = (data, request) =>
    action(types.ENTRY_MORE_NEWEST_ITERATOR_SUCCESS, { data, request });

export const entryMoreProfileIterator = column =>
    action(types.ENTRY_MORE_PROFILE_ITERATOR, { column });
export const entryMoreProfileIteratorError = (error, request) => {
    error.code = 'EMPIE01';
    error.messageId = 'entryMoreProfileIterator';
    return action(types.ENTRY_MORE_PROFILE_ITERATOR_ERROR, { error, request });
};
export const entryMoreProfileIteratorSuccess = (data, request) =>
    action(types.ENTRY_MORE_PROFILE_ITERATOR_SUCCESS, { data, request });

export const entryMoreStreamIterator = column => action(types.ENTRY_MORE_STREAM_ITERATOR, { column });
export const entryMoreStreamIteratorError = (error, request) => {
    error.code = 'EMSIE01';
    error.messageId = 'entryMoreStreamIterator';
    return action(types.ENTRY_MORE_STREAM_ITERATOR_ERROR, { error, request });
};
export const entryMoreStreamIteratorSuccess = (data, request) =>
    action(types.ENTRY_MORE_STREAM_ITERATOR_SUCCESS, { data, request });

export const entryMoreTagIterator = column =>
    action(types.ENTRY_MORE_TAG_ITERATOR, { column });
export const entryMoreTagIteratorError = (error, request) => {
    error.code = 'EMTIE01';
    error.messageId = 'entryMoreTagIterator';
    return action(types.ENTRY_MORE_TAG_ITERATOR_ERROR, { error, request });
};
export const entryMoreTagIteratorSuccess = (data, request) =>
    action(types.ENTRY_MORE_TAG_ITERATOR_SUCCESS, { data, request });

export const entryNewestIterator = (column, reversed) =>
    action(types.ENTRY_NEWEST_ITERATOR, { column, reversed });
export const entryNewestIteratorError = (error, request) => {
    error.code = 'ENIE01';
    error.messageId = 'entryNewestIterator';
    return action(types.ENTRY_NEWEST_ITERATOR_ERROR, { error, request });
};
export const entryNewestIteratorSuccess = (data, request) =>
    action(types.ENTRY_NEWEST_ITERATOR_SUCCESS, { data, request });

export const entryPageHide = () => action(types.ENTRY_PAGE_HIDE);
export const entryPageShow = (entryId, version) =>
    action(types.ENTRY_PAGE_SHOW, { entryId, version });

export const entryProfileIterator = ({ column, entryType }) =>
    action(types.ENTRY_PROFILE_ITERATOR, { column, entryType });

export const entryProfileIteratorError = (error, request) => {
    error.code = 'EPIE01';
    error.messageId = 'entryProfileIterator';
    return action(types.ENTRY_PROFILE_ITERATOR_ERROR, { error, request });
};
export const entryProfileIteratorSuccess = (data, request) =>
    action(types.ENTRY_PROFILE_ITERATOR_SUCCESS, { data, request });

export const entryResolveIpfsHash = ({ entryId, ipfsHash }) =>
    action(types.ENTRY_RESOLVE_IPFS_HASH, { entryId, ipfsHash });
export const entryResolveIpfsHashError = (error, request) => {
    error.code = 'ERIHE01';
    error.messageId = 'entryResolveIpfsHash';
    return action(types.ENTRY_RESOLVE_IPFS_HASH_ERROR, { error, request });
};
export const entryResolveIpfsHashSuccess = (data, request) =>
    action(types.ENTRY_RESOLVE_IPFS_HASH_SUCCESS, { data, request });

export const entryStreamIterator = (column, reversed) =>
    action(types.ENTRY_STREAM_ITERATOR, { column, reversed });
export const entryStreamIteratorError = (error, request) => {
    error.code = 'ESIE01';
    error.messageId = 'entryStreamIterator';
    return action(types.ENTRY_STREAM_ITERATOR_ERROR, { error, request });
};
export const entryStreamIteratorSuccess = (data, request) =>
    action(types.ENTRY_STREAM_ITERATOR_SUCCESS, { data, request });

export const entryTagIterator = (column, reversed) =>
    action(types.ENTRY_TAG_ITERATOR, { column, reversed });
export const entryTagIteratorError = (error, request) => {
    error.code = 'ETIE01';
    error.messageId = 'entryTagIterator';
    return action(types.ENTRY_TAG_ITERATOR_ERROR, { error, request });
};
export const entryTagIteratorSuccess = (data, request) =>
    action(types.ENTRY_TAG_ITERATOR_SUCCESS, { data, request });

export const entryUpvote = ({ actionId, entryId, entryTitle, ethAddress, weight, value }) =>
    action(types.ENTRY_UPVOTE, { actionId, entryId, entryTitle, ethAddress, weight, value });
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
