import {List, Map} from 'immutable';
import {isEmpty} from 'ramda';
import * as types from '../constants';
import {createReducer} from './create-reducer';
import {CommentAuthor, CommentRecord, CommentsState} from './records';

const initialState = new CommentsState();
const hexZero = '0x0000000000000000000000000000000000000000000000000000000000000000';

const createCommentWithAuthor = (comment) => {
    if (!comment.parent || comment.parent === hexZero) {
        comment.parent = '0';
    }
    return new CommentRecord(comment).set('author', new CommentAuthor(comment.author));
};

// const iteratorHandler = (state, collection) => {
//     let byId = state.get('byId');
//     let firstComm = collection[collection.length - 1].commentId;
//     let lastComm = collection[0].commentId;
//     const oldMargins = { firstComm: state.get('firstComm'), lastComm: state.get('lastComm') };
//     collection.forEach((comm) => {
//         // byId = byId.set(comm.commentId, getCommentRecord(comm));
//     });
//     byId = byId.sort(comparator);
//     firstComm = !oldMargins.firstComm || Number(firstComm) < Number(oldMargins.firstComm) ?
//         firstComm :
//         oldMargins.firstComm;
//     lastComm = !oldMargins.lastComm || Number(lastComm) > Number(oldMargins.lastComm) ?
//         lastComm :
//         oldMargins.lastComm;
//     return { byId, firstComm, lastComm };
// };

const sortByScore = (byId, list = new List()) => {
    return list.sort((a, b) => {
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
};

const commentsState = createReducer(initialState, {
    [types.CLEAN_STORE]: () => initialState,

    [types.COMMENTS_CHECK_NEW_SUCCESS]: (state, {data, request}) => {
        const {collection, lastBlock} = data;
        if (!collection.length) {
            return state.setIn(['newComments', 'lastBlock'], lastBlock);
        }
        let byId = state.get('byId');
        let comments = state.getIn(['newComments', 'comments']);
        collection.forEach((comm) => {
            comm.entryId = request.entryId;
            const comment = createCommentWithAuthor(comm);
            byId = byId.set(comm.commentId, comment);
            comments = comments.push(comm.commentId);
        });
        return state.merge({
            byId,
            newComments: state.get('newComments').merge({lastBlock, comments})
        });
    },

    [types.COMMENTS_CLEAN]: () => initialState,

    [types.COMMENTS_GET_SCORE_SUCCESS]: (state, {data}) => {
        const {commentId, score} = data;
        if (score === state.getIn(['byId', commentId, 'score'])) {
            return state;
        }
        const byId = state.get('byId').setIn([commentId, 'score'], score);
        const parent = byId.getIn([commentId, 'parent']);
        const list = sortByScore(byId, state.getIn(['byParent', parent]));
        return state.merge({
            byId,
            byParent: state.get('byParent').set(parent, list)
        });
    },

    [types.COMMENTS_GET_VOTE_OF_SUCCESS]: (state, {data}) => {
        const votes = {};
        data.collection.forEach((res) => {
            votes[res.commentId] = res.vote;
        });
        return state.mergeIn(['votes'], new Map(votes));
    },

    [types.COMMENTS_ITERATOR]: (state, {parent}) =>
        state.setIn(['flags', 'fetchingComments', parent], true),

    [types.COMMENTS_ITERATOR_ERROR]: (state, {request}) =>
        state.setIn(['flags', 'fetchingComments', request.parent], false),

    [types.COMMENTS_ITERATOR_SUCCESS]: (state, {data, request}) => {
        let byId = state.get('byId');
        const parent = request.parent;
        let newState = state;
        data.collection.forEach((comm) => {
            if (!comm.parent || comm.parent === hexZero) {
                comm.parent = '0';
            }
            let list = newState.getIn(['byParent', comm.parent]) || new List();
            comm.entryId = request.entryId;
            const comment = createCommentWithAuthor(comm);
            byId = newState.get('byId').set(comm.commentId, comment);
            list = list.includes(comm.commentId) ? list : list.push(comm.commentId);
            list = sortByScore(byId, list);
            newState = newState.merge({
                byId: byId,
                byParent: newState.get('byParent').set(comm.parent, list)
            });
        });

        return newState.merge({
            flags: state.get('flags').setIn(['fetchingComments', parent], false),
            lastBlock: state.get('lastBlock').set(parent, data.lastBlock),
            lastIndex: state.get('lastIndex').set(parent, data.lastIndex),
            moreComments: state.get('moreComments').set(parent, !!data.lastBlock),
            newestCommentBlock: state.get('newestCommentBlock').set(parent, request.toBlock)
        });
    },

    [types.COMMENTS_ITERATOR_REVERSED_SUCCESS]: (state, {data, request}) => {
        let byId = state.get('byId');
        const parent = request.parent;
        let list = state.getIn(['byParent', parent]) || new List();
        data.collection.forEach((comm) => {
            comm.entryId = request.entryId;
            const comment = createCommentWithAuthor(comm);
            byId = byId.set(comm.commentId, comment);
            list = list.includes(comm.commentId) ? list : list.push(comm.commentId);
        });
        list = sortByScore(byId, list);

        return state.merge({
            byId,
            byParent: state.get('byParent').set(parent, list),
            newComments: state.get('newComments').set('lastBlock', data.lastBlock),
            newestCommentBlock: state.get('newestCommentBlock').set(parent, data.lastBlock)
        });
    },

    [types.COMMENTS_LOAD_NEW]: (state) => {
        const newComments = state.getIn(['newComments', 'comments']);
        if (!newComments.size) {
            return state;
        }
        const byId = state.get('byId');
        let byParent = state.get('byParent');
        let newestCommentBlock = state.get('newestCommentBlock');
        newComments.forEach((id) => {
            const comment = state.getIn(['byId', id]);
            let parent = comment.get('parent');
            if (!parent || parent === hexZero) {
                parent = '0';
            }
            const list = sortByScore(byId, byParent.get(parent).push(id));
            byParent = byParent.set(parent, list);
            newestCommentBlock = newestCommentBlock.set(parent, state.getIn(['newComments', 'lastBlock']));
        });
        return state.merge({
            byParent,
            newComments: state.get('newComments').set('comments', new List()),
            newestCommentBlock
        });
    },

    [types.COMMENTS_MORE_ITERATOR]: (state, {parent}) =>
        state.setIn(['flags', 'fetchingMoreComments', parent], true),

    [types.COMMENTS_MORE_ITERATOR_ERROR]: (state, {request}) =>
        state.setIn(['flags', 'fetchingMoreComments', request.parent], false),

    [types.COMMENTS_MORE_ITERATOR_SUCCESS]: (state, {data, request}) => {
        let byId = state.get('byId');
        const parent = request.parent;
        let list = state.getIn(['byParent', parent]) || new List();
        data.collection.forEach((comm) => {
            comm.entryId = request.entryId;
            const comment = createCommentWithAuthor(comm);
            byId = byId.set(comm.commentId, comment);
            list = list.includes(comm.commentId) ? list : list.push(comm.commentId);
        });
        return state.merge({
            byId,
            byParent: state.get('byParent').set(parent, list),
            flags: state.get('flags').setIn(['fetchingMoreComments', parent], false),
            lastBlock: state.get('lastBlock').set(parent, data.lastBlock),
            lastIndex: state.get('lastIndex').set(parent, data.lastIndex),
            moreComments: state.get('moreComments').set(parent, !!data.lastBlock)
        });
    },

    [types.COMMENTS_RESOLVE_IPFS_HASH]: (state, {ipfsHashes, commentIds}) => {
        let byHash = state.get('byHash');
        let resolvingComments = state.getIn(['flags', 'resolvingComments']);
        ipfsHashes.forEach((hash, index) => {
            resolvingComments = resolvingComments.set(hash, true);
            byHash = byHash.set(hash, commentIds[index]);
        });
        return state.merge({
            byHash,
            flags: state.get('flags').set('resolvingComments', resolvingComments)
        });
    },

    [types.COMMENTS_RESOLVE_IPFS_HASH_ERROR]: (state, {data}) =>
        state.setIn(['flags', 'resolvingComments', data], false),

    [types.COMMENTS_RESOLVE_IPFS_HASH_SUCCESS]: (state, {data}) => {
        if (!data.ipfsHash || isEmpty(data)) {
            return state;
        }
        const commentId = state.getIn(['byHash', data.ipfsHash]);
        return state.merge({
            byId: state.get('byId').setIn([commentId, 'content'], data.content),
            flags: state.get('flags').setIn(['resolvingComments', data.ipfsHash], false)
        });
    },
});

export default commentsState;

