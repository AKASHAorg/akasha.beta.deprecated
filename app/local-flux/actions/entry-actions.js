import { action } from './helpers';
import * as types from '../constants';
import { ENTRY_MODULE, COMMENTS_MODULE } from '@akashaproject/common/constants';

export const entryCanClaim = entryIds => action(`${ENTRY_MODULE.canClaim}`, { entryIds });

export const entryCanClaimVote = entryIds => action(`${ENTRY_MODULE.canClaimVote}`, { entryIds });

export const entryClaim = ({ actionId, entryId, entryTitle }) =>
    action(`${ENTRY_MODULE.claim}`, { actionId, entryId, entryTitle });

export const entryClaimVote = ({ actionId, entryId, entryTitle }) =>
    action(`${ENTRY_MODULE.claimVote}`, { actionId, entryId, entryTitle });

export const entryCleanFull = () => action(types.ENTRY_CLEAN_FULL);

export const entryDownvote = ({ actionId, entryId, entryTitle, ethAddress, weight, value }) =>
    action(`${ENTRY_MODULE.downVote}`, { actionId, entryId, entryTitle, ethAddress, weight, value });

export const entryGetBalance = (entryIds, claimable) =>
    action(`${ENTRY_MODULE.getEntryBalance}`, { entryIds, claimable });

export const entryGetEndPeriod = entryIds => action(`${ENTRY_MODULE.getVoteEndPeriod}`, { entryIds });

export const entryGetFull = ({
    akashaId, entryId, ethAddress, version, asDraft,
    revert, publishedDateOnly, latestVersion
}) =>
    action(`${ENTRY_MODULE.getEntry}`, {
        akashaId, entryId, ethAddress, version, asDraft, revert, publishedDateOnly, latestVersion
    });

export const entryGetFullAsDraft = data => action(types.ENTRY_GET_FULL_AS_DRAFT, { data });
export const entryGetFullAsDraftError = error => action(types.ENTRY_GET_FULL_AS_DRAFT_ERROR, { error });
export const entryGetFullAsDraftSuccess = data => action(types.ENTRY_GET_FULL_AS_DRAFT_SUCCESS, { data });

export const entryGetVersionPublishedDateSuccess = (data, req) =>
    action(types.ENTRY_GET_VERSION_PUBLISHED_DATE_SUCCESS, { data, req });

export const entryGetVersionPublishedDateError = error =>
    action(types.ENTRY_GET_VERSION_PUBLISHED_DATE_ERROR, { error });

export const entryGetLatestVersion = entryId => action(`${ENTRY_MODULE.getLatestEntryVersion}`, { entryId });

export const entryGetScore = entryId => action(`${ENTRY_MODULE.getScore}`, { entryId });

export const entryGetShort = ({ context, entryId, ethAddress, batching, includeVotes }) =>
    action(`${ENTRY_MODULE.getEntry}`, { context, entryId, ethAddress, batching, includeVotes });

export const entryGetVoteOf = (entryIds, claimable) =>
    action(`${ENTRY_MODULE.getVoteOf}`, { entryIds, claimable });

export const entryGetVoteRatio = data => action(`${ENTRY_MODULE.getVoteRatio}`, { data });

export const entryListIterator = column =>
    action(`${ENTRY_MODULE.entryListIterator}`, { column });

export const entryMoreListIterator = (column, batching) =>
    action(types.ENTRY_MORE_LIST_ITERATOR, { column, batching });
// export const entryMoreListIteratorSuccess = (data, request) =>
//     action(types.ENTRY_MORE_LIST_ITERATOR_SUCCESS, { data, request });

export const entryMoreNewestIterator = (column, batching) =>
    action(types.ENTRY_MORE_NEWEST_ITERATOR, { column, batching });
// export const entryMoreNewestIteratorError = (error, request) => {
//     error.code = 'EMNIE01';
//     error.messageId = 'entryMoreNewestIterator';
//     return action(types.ENTRY_MORE_NEWEST_ITERATOR_ERROR, { error, request });
// };
// export const entryMoreNewestIteratorSuccess = (data, request) =>
//     action(types.ENTRY_MORE_NEWEST_ITERATOR_SUCCESS, { data, request });

export const entryMoreProfileIterator = (column, batching) =>
    action(types.ENTRY_MORE_PROFILE_ITERATOR, { column, batching });
// export const entryMoreProfileIteratorError = (error, request) => {
//     error.code = 'EMPIE01';
//     error.messageId = 'entryMoreProfileIterator';
//     return action(types.ENTRY_MORE_PROFILE_ITERATOR_ERROR, { error, request });
// };
// export const entryMoreProfileIteratorSuccess = (data, request) =>
//     action(types.ENTRY_MORE_PROFILE_ITERATOR_SUCCESS, { data, request });

export const entryMoreStreamIterator = (column, batching) => action(types.ENTRY_MORE_STREAM_ITERATOR, { column, batching });
// export const entryMoreStreamIteratorError = (error, request) => {
//     error.code = 'EMSIE01';
//     error.messageId = 'entryMoreStreamIterator';
//     return action(types.ENTRY_MORE_STREAM_ITERATOR_ERROR, { error, request });
// };
// export const entryMoreStreamIteratorSuccess = (data, request) =>
//     action(types.ENTRY_MORE_STREAM_ITERATOR_SUCCESS, { data, request });

export const entryMoreTagIterator = (column, batching) =>
    action(types.ENTRY_MORE_TAG_ITERATOR, { column, batching });
// export const entryMoreTagIteratorError = (error, request) => {
//     error.code = 'EMTIE01';
//     error.messageId = 'entryMoreTagIterator';
//     return action(types.ENTRY_MORE_TAG_ITERATOR_ERROR, { error, request });
// };
// export const entryMoreTagIteratorSuccess = (data, request) =>
//     action(types.ENTRY_MORE_TAG_ITERATOR_SUCCESS, { data, request });

export const entryNewestIterator = (column, batching) =>
    action(types.ENTRY_NEWEST_ITERATOR, { column, batching });
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

export const entryProfileIterator = (column, batching) =>
    action(types.ENTRY_PROFILE_ITERATOR, { column, batching });

export const entryProfileIteratorError = (error, request) => {
    error.code = 'EPIE01';
    error.messageId = 'entryProfileIterator';
    return action(types.ENTRY_PROFILE_ITERATOR_ERROR, { error, request });
};
export const entryProfileIteratorSuccess = (data, request) =>
    action(types.ENTRY_PROFILE_ITERATOR_SUCCESS, { data, request });

export const entryResolveIpfsHash = ({ entryId, ipfsHash }) =>
    action(`${ENTRY_MODULE.resolveEntriesIpfsHash}`, { entryId, ipfsHash });

export const entryStreamIterator = (column, batching) =>
    action(`${ENTRY_MODULE.allStreamIterator}`, { column, batching });

export const entryTagIterator = (column, batching) =>
    action(`${ENTRY_MODULE.entryTagIterator}`, { column, batching });

export const entryUpvote = ({ actionId, entryId, entryTitle, ethAddress, weight, value }) =>
    action(`${ENTRY_MODULE.upVote}`, { actionId, entryId, entryTitle, ethAddress, weight, value });

export const entryVoteCost = () => action(`${ENTRY_MODULE.voteCost}`);
