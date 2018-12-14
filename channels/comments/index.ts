import addCommentInit from './add-comment';
import commentsCountInit from './comments-count';
import getCommentInit from './get-comment';
import removeCommentInit from './remove-comment';
import commentsIteratorInit from './comments-iterator';
import resolveCommentsIpfsHashInit from './resolve-comments-ipfs-hash';
import downvoteCommentInit from './downvote-comment';
import upvoteCommentInit from './upvote-comment';
import voteOfInit from './vote-of';
import getScoreInit from './get-score';
import initIpfsComments from './ipfs';
import { COMMENTS_MODULE } from '@akashaproject/common/constants';

const init = function init(sp, getService) {
  initIpfsComments(sp, getService);
  const addComment = addCommentInit(sp, getService);
  const commentsCount = commentsCountInit(sp, getService);
  const getComment = getCommentInit(sp, getService);
  const removeComment = removeCommentInit(sp, getService);
  const commentsIterator = commentsIteratorInit(sp, getService);
  const resolveCommentsIpfsHash = resolveCommentsIpfsHashInit(sp, getService);
  const downvoteComment = downvoteCommentInit(sp, getService);
  const upvoteComment = upvoteCommentInit(sp, getService);
  const voteOf = voteOfInit(sp, getService);
  const getScore = getScoreInit(sp, getService);

  return {
    [COMMENTS_MODULE.comment]: addComment,
    [COMMENTS_MODULE.commentsCount]: commentsCount,
    [COMMENTS_MODULE.getComment]: getComment,
    [COMMENTS_MODULE.removeComment]: removeComment,
    [COMMENTS_MODULE.commentsIterator]: commentsIterator,
    [COMMENTS_MODULE.resolveCommentsIpfsHash]: resolveCommentsIpfsHash,
    [COMMENTS_MODULE.downVote]: downvoteComment,
    [COMMENTS_MODULE.upvote]: upvoteComment,
    [COMMENTS_MODULE.getVoteOf]: voteOf,
    [COMMENTS_MODULE.getScore]: getScore,
  };
};

const app = {
  init,
  moduleName: COMMENTS_MODULE.$name,
};

export default app;
