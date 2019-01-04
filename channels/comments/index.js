"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const add_comment_1 = require("./add-comment");
const comments_count_1 = require("./comments-count");
const get_comment_1 = require("./get-comment");
const remove_comment_1 = require("./remove-comment");
const comments_iterator_1 = require("./comments-iterator");
const resolve_comments_ipfs_hash_1 = require("./resolve-comments-ipfs-hash");
const downvote_comment_1 = require("./downvote-comment");
const upvote_comment_1 = require("./upvote-comment");
const vote_of_1 = require("./vote-of");
const get_score_1 = require("./get-score");
const ipfs_1 = require("./ipfs");
const constants_1 = require("@akashaproject/common/constants");
const init = function init(sp, getService) {
    ipfs_1.default(sp, getService);
    const addComment = add_comment_1.default(sp, getService);
    const commentsCount = comments_count_1.default(sp, getService);
    const getComment = get_comment_1.default(sp, getService);
    const removeComment = remove_comment_1.default(sp, getService);
    const commentsIterator = comments_iterator_1.default(sp, getService);
    const resolveCommentsIpfsHash = resolve_comments_ipfs_hash_1.default(sp, getService);
    const downvoteComment = downvote_comment_1.default(sp, getService);
    const upvoteComment = upvote_comment_1.default(sp, getService);
    const voteOf = vote_of_1.default(sp, getService);
    const getScore = get_score_1.default(sp, getService);
    return {
        [constants_1.COMMENTS_MODULE.comment]: addComment,
        [constants_1.COMMENTS_MODULE.commentsCount]: commentsCount,
        [constants_1.COMMENTS_MODULE.getComment]: getComment,
        [constants_1.COMMENTS_MODULE.removeComment]: removeComment,
        [constants_1.COMMENTS_MODULE.commentsIterator]: commentsIterator,
        [constants_1.COMMENTS_MODULE.resolveCommentsIpfsHash]: resolveCommentsIpfsHash,
        [constants_1.COMMENTS_MODULE.downVote]: downvoteComment,
        [constants_1.COMMENTS_MODULE.upvote]: upvoteComment,
        [constants_1.COMMENTS_MODULE.getVoteOf]: voteOf,
        [constants_1.COMMENTS_MODULE.getScore]: getScore,
    };
};
const app = {
    init,
    moduleName: constants_1.COMMENTS_MODULE.$name,
};
exports.default = app;
//# sourceMappingURL=index.js.map