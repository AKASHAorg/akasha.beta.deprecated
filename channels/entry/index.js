"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entry_count_profile_1 = require("./entry-count-profile");
const entry_count_tag_1 = require("./entry-count-tag");
const entry_tag_iterator_1 = require("./entry-tag-iterator");
const entry_profile_iterator_1 = require("./entry-profile-iterator");
const get_entry_1 = require("./get-entry");
const publish_entry_1 = require("./publish-entry");
const can_claim_1 = require("./can-claim");
const claim_deposit_1 = require("./claim-deposit");
const downvote_entry_1 = require("./downvote-entry");
const entry_score_1 = require("./entry-score");
const upvote_entry_1 = require("./upvote-entry");
const vote_cost_1 = require("./vote-cost");
const get_vote_of_1 = require("./get-vote-of");
const votes_iterator_1 = require("./votes-iterator");
const get_entry_balance_1 = require("./get-entry-balance");
const get_entry_list_1 = require("./get-entry-list");
const edit_entry_1 = require("./edit-entry");
const following_stream_iterator_1 = require("./following-stream-iterator");
const all_stream_iterator_1 = require("./all-stream-iterator");
const get_latest_entry_version_1 = require("./get-latest-entry-version");
const get_entry_ipfs_hash_1 = require("./get-entry-ipfs-hash");
const resolve_entries_ipfs_hash_1 = require("./resolve-entries-ipfs-hash");
const can_claim_vote_1 = require("./can-claim-vote");
const claim_vote_1 = require("./claim-vote");
const vote_ratio_1 = require("./vote-ratio");
const vote_endperiod_1 = require("./vote-endperiod");
const my_votes_iterator_1 = require("./my-votes-iterator");
const sync_entries_1 = require("./sync-entries");
const helpers_1 = require("./helpers");
const ipfs_1 = require("./ipfs");
const constants_1 = require("@akashaproject/common/constants");
const init = function init(sp, getService) {
    helpers_1.default(sp, getService);
    ipfs_1.default(sp, getService);
    const entryCountProfile = entry_count_profile_1.default(sp, getService);
    const entryCountTag = entry_count_tag_1.default(sp, getService);
    const entryTagIterator = entry_tag_iterator_1.default(sp, getService);
    const entryProfileIterator = entry_profile_iterator_1.default(sp, getService);
    const getEntry = get_entry_1.default(sp, getService);
    const publishEntry = publish_entry_1.default(sp, getService);
    const canClaim = can_claim_1.default(sp, getService);
    const claimDeposit = claim_deposit_1.default(sp, getService);
    const downVoteEntry = downvote_entry_1.default(sp, getService);
    const entryScore = entry_score_1.default(sp, getService);
    const upVoteEntry = upvote_entry_1.default(sp, getService);
    const voteCost = vote_cost_1.default(sp, getService);
    const getVoteOf = get_vote_of_1.default(sp, getService);
    const votesIterator = votes_iterator_1.default(sp, getService);
    const getEntryBalance = get_entry_balance_1.default(sp, getService);
    const getEntryList = get_entry_list_1.default(sp, getService);
    const editEntry = edit_entry_1.default(sp, getService);
    const followingStreamIterator = following_stream_iterator_1.default(sp, getService);
    const allStreamIterator = all_stream_iterator_1.default(sp, getService);
    const getLatestEntryVersion = get_latest_entry_version_1.default(sp, getService);
    const getEntryIpfsHash = get_entry_ipfs_hash_1.default(sp, getService);
    const resolveEntriesIpfsHash = resolve_entries_ipfs_hash_1.default(sp, getService);
    const canClaimVote = can_claim_vote_1.default(sp, getService);
    const claimVote = claim_vote_1.default(sp, getService);
    const voteRatio = vote_ratio_1.default(sp, getService);
    const getVoteEndPeriod = vote_endperiod_1.default(sp, getService);
    const myVotesIterator = my_votes_iterator_1.default(sp, getService);
    const syncEntries = sync_entries_1.default(sp, getService);
    return {
        [constants_1.ENTRY_MODULE.getProfileEntriesCount]: entryCountProfile,
        [constants_1.ENTRY_MODULE.getTagEntriesCount]: entryCountTag,
        [constants_1.ENTRY_MODULE.entryTagIterator]: entryTagIterator,
        [constants_1.ENTRY_MODULE.entryProfileIterator]: entryProfileIterator,
        [constants_1.ENTRY_MODULE.getEntry]: getEntry,
        [constants_1.ENTRY_MODULE.publish]: publishEntry,
        [constants_1.ENTRY_MODULE.canClaim]: canClaim,
        [constants_1.ENTRY_MODULE.claim]: claimDeposit,
        [constants_1.ENTRY_MODULE.downVote]: downVoteEntry,
        [constants_1.ENTRY_MODULE.getScore]: entryScore,
        [constants_1.ENTRY_MODULE.upVote]: upVoteEntry,
        [constants_1.ENTRY_MODULE.voteCost]: voteCost,
        [constants_1.ENTRY_MODULE.getVoteOf]: getVoteOf,
        [constants_1.ENTRY_MODULE.votesIterator]: votesIterator,
        [constants_1.ENTRY_MODULE.getEntryBalance]: getEntryBalance,
        [constants_1.ENTRY_MODULE.getEntryList]: getEntryList,
        [constants_1.ENTRY_MODULE.editEntry]: editEntry,
        [constants_1.ENTRY_MODULE.followingStreamIterator]: followingStreamIterator,
        [constants_1.ENTRY_MODULE.allStreamIterator]: allStreamIterator,
        [constants_1.ENTRY_MODULE.getLatestEntryVersion]: getLatestEntryVersion,
        [constants_1.ENTRY_MODULE.getEntryIpfsHash]: getEntryIpfsHash,
        [constants_1.ENTRY_MODULE.resolveEntriesIpfsHash]: resolveEntriesIpfsHash,
        [constants_1.ENTRY_MODULE.canClaimVote]: canClaimVote,
        [constants_1.ENTRY_MODULE.claimVote]: claimVote,
        [constants_1.ENTRY_MODULE.getVoteRatio]: voteRatio,
        [constants_1.ENTRY_MODULE.getVoteEndPeriod]: getVoteEndPeriod,
        [constants_1.ENTRY_MODULE.myVotesIterator]: myVotesIterator,
        [constants_1.ENTRY_MODULE.syncEntries]: syncEntries,
    };
};
const app = {
    init,
    moduleName: constants_1.ENTRY_MODULE.$name,
};
exports.default = app;
//# sourceMappingURL=index.js.map