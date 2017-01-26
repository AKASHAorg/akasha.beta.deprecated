import entryCountProfile from './entry-count-profile';
import entryCountTag from './entry-count-tag';
import entryTagIterator from './entry-tag-iterator';
import entryProfileIterator from './entry-profile-iterator';
import getEntry from './get-entry';
import publishEntry from './publish-entry';
import updateEntry from './update-entry';
import canClaim from './can-claim';
import claimDeposit from './claim-deposit';
import downVoteEntry from './downvote-entry';
import entryScore from './entry-score';
import isActive from './entry-is-active';
import getDepositBalance from './get-deposit-balance';
import upVoteEntry from './upvote-entry';
import voteCost from './vote-cost';
import voteCount from './vote-count';
import getVoteOf from './get-vote-of';
import votesIterator from './votes-iterator';
import getEntriesStream from './entry-stream';
import getEntryBalance from './get-entry-balance';
import getEntryList from './get-entry-list';
import runner from '../pinner/index';
import editEntry from './edit-entry';
import followingStreamIterator from './following-stream-iterator';
import allStreamIterator from './all-stream-iterator';

export default [
    entryCountProfile,
    entryCountTag,
    getEntry,
    publishEntry,
    updateEntry,
    canClaim,
    claimDeposit,
    downVoteEntry,
    entryScore,
    getDepositBalance,
    getEntriesStream,
    upVoteEntry,
    voteCost,
    voteCount,
    entryTagIterator,
    entryProfileIterator,
    votesIterator,
    getVoteOf,
    isActive,
    getEntryBalance,
    getEntryList,
    editEntry,
    followingStreamIterator,
    allStreamIterator,
    runner[0]
]
