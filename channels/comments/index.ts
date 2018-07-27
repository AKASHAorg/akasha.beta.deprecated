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

export const moduleName = 'comments';

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
    addComment,
    commentsCount,
    getComment,
    removeComment,
    commentsIterator,
    resolveCommentsIpfsHash,
    downvoteComment,
    upvoteComment,
    voteOf,
    getScore,
  };
};

const app = {
  init,
  moduleName,
};

export default app;
