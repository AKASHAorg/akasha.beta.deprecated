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

// const Flags = Record({
//     commentsFetched: new Map(),
//     fetchingComments: new Map(),
//     fetchingMoreComments: new Map(),
//     pendingComments: new Map(),
//     resolvingComments: new Map()
// });

const NewComments = Record({
    lastBlock: null,
    comments: new List()
});

export const ProfileComments = Record({
    commentIds: new List(),
    // fetchingComments: false,
    // fetchingMoreComments: false,
    lastBlock: null,
    lastIndex: null,
    moreEntries: false
});

export const CommentsState = Record({
    byId: new Map(),
    byParent: new Map(),
    byHash: new Map(),
    errors: new List(),
    // flags: new Flags(),
    lastBlock: new Map(),
    lastIndex: new Map(),
    moreComments: new Map(),
    newComments: new NewComments(),
    newestCommentBlock: new Map(),
    profileComments: new Map(),
    votes: new Map(),
});

export default class CommentsStateModel extends CommentsState {
    constructor (params) {
        super(params);
        this.hexZero = '0x0000000000000000000000000000000000000000000000000000000000000000';
    }
    createCommentWithAuthor = (record) => {
        const comment = Object.assign({}, record);
        if (!comment.parent || comment.parent === this.hexZero) {
            comment.parent = '0';
        }
        return new CommentRecord(comment).set('author', new CommentAuthor(comment.author));
    };
    sortByScore = (byId, list = new List()) =>
        list.sort((a, b) => {
            const commA = byId.get(a);
            const commB = byId.get(b);

            if (commA.score > commB.score) {
                return -1;
            }
            if (commA.score < commB.score) {
                return 1;
            }
            if (commA.publishDate > commB.publishDate) {
                return -1;
            }
            if (commA.publishDate < commB.publishDate) {
                return 1;
            }
            return 0;
        });
}