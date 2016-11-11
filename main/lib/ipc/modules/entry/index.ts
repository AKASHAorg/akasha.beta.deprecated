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
import getDepositBalance from './get-deposit-balance';
import upVoteEntry from './upvote-entry';
import voteCost from './vote-cost';
import voteCount from './vote-count';
import votesIterator from './votes-iterator';


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
    upVoteEntry,
    voteCost,
    voteCount,
    entryTagIterator,
    entryProfileIterator,
    votesIterator
]
