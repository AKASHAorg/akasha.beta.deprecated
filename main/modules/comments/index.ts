import addComment from './add-comment';
import commentsCount from './comments-count';
import getComment from './get-comment';
import removeComment from './remove-comment';
import commentsIterator from './comments-iterator';
import commentsParentIterator from './comments-parent-iterator';
import commentsLazy from './comments-lazy';
import repliesLazy from './replies-lazy';
import getProfileComments from './get-profile-comments';
import resolveCommentsIpfsHash from './resolve-comments-ipfs-hash';

export default [
    addComment,
    commentsCount,
    getComment,
    removeComment,
    commentsIterator,
    commentsParentIterator,
    commentsLazy,
    repliesLazy,
    getProfileComments,
    resolveCommentsIpfsHash
];
