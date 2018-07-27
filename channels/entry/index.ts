import entryCountProfileInit from './entry-count-profile';
import entryCountTagInit from './entry-count-tag';
import entryTagIteratorInit from './entry-tag-iterator';
import entryProfileIteratorInit from './entry-profile-iterator';
import getEntryInit from './get-entry';
import publishEntryInit from './publish-entry';
import canClaimInit from './can-claim';
import claimDepositInit from './claim-deposit';
import downVoteEntryInit from './downvote-entry';
import entryScoreInit from './entry-score';
import upVoteEntryInit from './upvote-entry';
import voteCostInit from './vote-cost';
import getVoteOfInit from './get-vote-of';
import votesIteratorInit from './votes-iterator';
import getEntryBalanceInit from './get-entry-balance';
import getEntryListInit from './get-entry-list';
import editEntryInit from './edit-entry';
import followingStreamIteratorInit from './following-stream-iterator';
import allStreamIteratorInit from './all-stream-iterator';
import getLatestEntryVersionInit from './get-latest-entry-version';
import getEntryIpfsHashInit from './get-entry-ipfs-hash';
import resolveEntriesIpfsHashInit from './resolve-entries-ipfs-hash';
import canClaimVoteInit from './can-claim-vote';
import claimVoteInit from './claim-vote';
import voteRatioInit from './vote-ratio';
import getVoteEndPeriodInit from './vote-endperiod';
import myVotesIteratorInit from './my-votes-iterator';
import syncEntriesInit from './sync-entries';

import helpersInit from './helpers';
import ipfsInit from './ipfs';

export const moduleName = 'entry';

const init = function init(sp, getService) {

  helpersInit(sp, getService);
  ipfsInit(sp, getService);

  const entryCountProfile = entryCountProfileInit(sp, getService);
  const entryCountTag = entryCountTagInit(sp, getService);
  const entryTagIterator = entryTagIteratorInit(sp, getService);
  const entryProfileIterator = entryProfileIteratorInit(sp, getService);
  const getEntry = getEntryInit(sp, getService);
  const publishEntry = publishEntryInit(sp, getService);
  const canClaim = canClaimInit(sp, getService);
  const claimDeposit = claimDepositInit(sp, getService);
  const downVoteEntry = downVoteEntryInit(sp, getService);
  const entryScore = entryScoreInit(sp, getService);
  const upVoteEntry = upVoteEntryInit(sp, getService);
  const voteCost = voteCostInit(sp, getService);
  const getVoteOf = getVoteOfInit(sp, getService);
  const votesIterator = votesIteratorInit(sp, getService);
  const getEntryBalance = getEntryBalanceInit(sp, getService);
  const getEntryList = getEntryListInit(sp, getService);
  const editEntry = editEntryInit(sp, getService);
  const followingStreamIterator = followingStreamIteratorInit(sp, getService);
  const allStreamIterator = allStreamIteratorInit(sp, getService);
  const getLatestEntryVersion = getLatestEntryVersionInit(sp, getService);
  const getEntryIpfsHash = getEntryIpfsHashInit(sp, getService);
  const resolveEntriesIpfsHash = resolveEntriesIpfsHashInit(sp, getService);
  const canClaimVote = canClaimVoteInit(sp, getService);
  const claimVote = claimVoteInit(sp, getService);
  const voteRatio = voteRatioInit(sp, getService);
  const getVoteEndPeriod = getVoteEndPeriodInit(sp, getService);
  const myVotesIterator = myVotesIteratorInit(sp, getService);
  const syncEntries = syncEntriesInit(sp, getService);

  return {
    entryCountProfile,
    entryCountTag,
    entryTagIterator,
    entryProfileIterator,
    getEntry,
    publishEntry,
    canClaim,
    claimDeposit,
    downVoteEntry,
    entryScore,
    upVoteEntry,
    voteCost,
    getVoteOf,
    votesIterator,
    getEntryBalance,
    getEntryList,
    editEntry,
    followingStreamIterator,
    allStreamIterator,
    getLatestEntryVersion,
    getEntryIpfsHash,
    resolveEntriesIpfsHash,
    canClaimVote,
    claimVote,
    voteRatio,
    getVoteEndPeriod,
    myVotesIterator,
    syncEntries,
  };
};

const app = {
  init,
  moduleName,
};

export default app;
