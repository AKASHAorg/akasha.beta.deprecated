import { List, Map, Record } from 'immutable';

export const CommentAuthor = Record({
    akashaId: null,
    ethAddress: null
});

export const CommentData = Record({
    active: null,
    parent: null,
    profile: new Map(),
    content: null,
    date: null,
    ipfsHash: null,
});

export const CommentRecord = Record({
    author: new CommentAuthor(),
    commentId: null,
    content: null,
    deleted: null,
    endPeriod: null,
    entryId: null,
    ipfsHash: null,
    isPublishing: false,
    parent: null,
    publishDate: null,
    score: null,
    tempTx: null,
    totalVotes: null,
});

const Flags = Record({
    fetchingComments: new Map(),
    fetchingMoreComments: new Map(),
    pendingComments: new Map(),
    resolvingComments: new Map()
});

const NewComments = Record({
    lastBlock: null,
    comments: new List()
});

export const ProfileComments = Record({
    commentIds: new List(),
    fetchingComments: false,
    fetchingMoreComments: false,
    lastBlock: null,
    lastIndex: null,
    moreEntries: false
});

export const CommentsState = Record({
    byId: new Map(),
    byParent: new Map(),
    byHash: new Map(),
    errors: new List(),
    flags: new Flags(),
    lastBlock: new Map(),
    lastIndex: new Map(),
    moreComments: new Map(),
    newComments: new NewComments(),
    newestCommentBlock: new Map(),
    profileComments: new Map(),
    votes: new Map(),
});
