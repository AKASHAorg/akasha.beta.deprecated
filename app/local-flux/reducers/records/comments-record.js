import { List, Map, Record } from 'immutable';

export const CommentData = Record({
    active: null,
    parent: null,
    profile: new Map(),
    content: null,
    date: null,
    ipfsHash: null,
});

export const CommentRecord = Record({
    entryId: null,
    data: new CommentData(),
    commentId: null,
    tempTx: null,
    isPublishing: false
});

const Flags = Record({
    fetchingComments: false,
    fetchingMoreComments: false
});

export const CommentsState = Record({
    byId: new Map(),
    errors: new List(),
    firstComm: null,
    flags: new Flags(),
    lastComm: null,
    moreComments: false,
    newComments: new Map(),
});
