import { List, Map } from 'immutable';
import * as types from '../constants';
import { createReducer } from './create-reducer';
import { CommentAuthor, CommentRecord, CommentsState } from './records';

const initialState = new CommentsState();

const comparator = (a, b) => {
    const first = Number(a.commentId);
    const second = Number(b.commentId);
    if (first > second) {
        return -1;
    }
    if (first < second) {
        return 1;
    }
    return 0;
};

const createCommentWithAuthor = comment =>
    new CommentRecord(comment).set('author', new CommentAuthor(comment.author));

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

const commentsState = createReducer(initialState, {
    [types.CLEAN_STORE]: () => initialState,

    [types.COMMENTS_CHECK_NEW_SUCCESS]: (state, { data, request }) => {
        const { collection, lastBlock } = data;
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
            newComments: state.get('newComments').merge({ lastBlock, comments })
        });
    },

    [types.COMMENTS_CLEAN]: () => initialState,

    [types.COMMENTS_ITERATOR]: (state, { parent }) =>
        state.setIn(['flags', 'fetchingComments', parent], true),

    [types.COMMENTS_ITERATOR_ERROR]: (state, { request }) =>
        state.setIn(['flags', 'fetchingComments', request.parent], false),

    [types.COMMENTS_ITERATOR_SUCCESS]: (state, { data, request }) => {
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
            flags: state.get('flags').setIn(['fetchingComments', parent], false),
            lastBlock: state.get('lastBlock').set(parent, data.lastBlock),
            lastIndex: state.get('lastIndex').set(parent, data.lastIndex),
            moreComments: state.get('moreComments').set(parent, !!data.lastBlock),
            newestCommentBlock: state.get('newestCommentBlock').set(parent, request.toBlock)
        });
    },

    [types.COMMENTS_ITERATOR_REVERSED_SUCCESS]: (state, { data, request }) => {
        let byId = state.get('byId');
        const parent = request.parent;
        const list = state.getIn(['byParent', parent]) || new List();
        let newList = new List();
        data.collection.forEach((comm) => {
            comm.entryId = request.entryId;
            const comment = createCommentWithAuthor(comm);
            byId = byId.set(comm.commentId, comment);
            newList = newList.includes(comm.commentId) ? newList : newList.push(comm.commentId);
        });

        return state.merge({
            byId,
            byParent: state.get('byParent').set(parent, newList.concat(list)),
            newComments: state.get('newComments').set('lastBlock', data.lastBlock),
            newestCommentBlock: state.get('newestCommentBlock').set(parent, data.lastBlock)
        });
    },

    [types.COMMENTS_LOAD_NEW]: (state) => {
        const newComments = state.getIn(['newComments', 'comments']);
        if (!newComments.size) {
            return state;
        }
        let byParent = state.get('byParent');
        let newestCommentBlock = state.get('newestCommentBlock');
        newComments.forEach((id) => {
            const comment = state.getIn(['byId', id]);
            const parent = comment.get('parent') || '0';
            const list = byParent.get(parent);
            byParent = byParent.set(parent, list.push(id));
            newestCommentBlock = newestCommentBlock.set(parent, state.getIn(['newComments', 'lastBlock']));
        });
        return state.merge({
            byParent,
            newComments: state.get('newComments').set('comments', new List()),
            newestCommentBlock
        });
    },

    [types.COMMENTS_MORE_ITERATOR]: (state, { parent }) =>
        state.setIn(['flags', 'fetchingMoreComments', parent], true),

    [types.COMMENTS_MORE_ITERATOR_ERROR]: (state, { request }) =>
        state.setIn(['flags', 'fetchingMoreComments', request.parent], false),

    [types.COMMENTS_MORE_ITERATOR_SUCCESS]: (state, { data, request }) => {
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

    [types.COMMENTS_RESOLVE_IPFS_HASH]: (state, { ipfsHashes, commentIds }) => {
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

    [types.COMMENTS_RESOLVE_IPFS_HASH_ERROR]: (state, { data }) =>
        state.setIn(['flags', 'resolvingComments', data], false),

    [types.COMMENTS_RESOLVE_IPFS_HASH_SUCCESS]: (state, { data }) => {
        const commentId = state.getIn(['byHash', data.ipfsHash]);
        if (!data.ipfsHash) {
            return state;
        }
        return state.merge({
            byId: state.get('byId').setIn([commentId, 'content'], data.content),
            flags: state.get('flags').setIn(['resolvingComments', data.ipfsHash], false)
        });
    },

    // when requesting a new entry, clear comments in the store
    [types.ENTRY_GET_FULL]: () => initialState,
});

export default commentsState;

