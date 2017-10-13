import { List, Map } from 'immutable';
import * as types from '../constants';
import { createReducer } from './create-reducer';
import { CommentAuthor, CommentData, CommentRecord, CommentsState } from './records';

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

const iteratorHandler = (state, collection) => {
    let byId = state.get('byId');
    let firstComm = collection[collection.length - 1].commentId;
    let lastComm = collection[0].commentId;
    const oldMargins = { firstComm: state.get('firstComm'), lastComm: state.get('lastComm') };
    collection.forEach((comm) => {
        // byId = byId.set(comm.commentId, getCommentRecord(comm));
    });
    byId = byId.sort(comparator);
    firstComm = !oldMargins.firstComm || Number(firstComm) < Number(oldMargins.firstComm) ?
        firstComm :
        oldMargins.firstComm;
    lastComm = !oldMargins.lastComm || Number(lastComm) > Number(oldMargins.lastComm) ?
        lastComm :
        oldMargins.lastComm;
    return { byId, firstComm, lastComm };
};

const commentsState = createReducer(initialState, {
    [types.CLEAN_STORE]: () => initialState,

    [types.COMMENTS_CHECK_NEW_SUCCESS]: (state, { data }) => {
        if (!data.collection.length) {
            return state;
        }
        let newComments = state.get('newComments');
        data.collection.forEach((comm) => {
            newComments = newComments.set(comm.commentId, getCommentRecord(comm));
        });
        return state.set('newComments', newComments);
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
            list = list.push(comm.commentId);
        });
        return state.merge({
            byId,
            byParent: state.get('byParent').set(parent, list),
            flags: state.get('flags').setIn(['fetchingComments', parent], false),
            lastBlock: state.get('lastBlock').set(parent, data.lastBlock),
            lastIndex: state.get('lastIndex').set(parent, data.lastIndex),
            moreComments: state.get('moreComments').set(parent, !!data.lastBlock)
        });
        // const { byId, firstComm, lastComm } = iteratorHandler(state, data.collection);
        // return state.merge({
        //     byId,
        //     firstComm: firstComm || null,
        //     flags: state.get('flags').set('fetchingComments', false),
        //     lastComm: lastComm || null,
        //     moreComments: !!data.lastBlock
        // });
    },

    [types.COMMENTS_LOAD_NEW]: (state) => {
        if (!state.get('newComments').size) {
            return state;
        }
        const newComments = state.get('newComments').sort(comparator);
        let lastComm = Number(newComments.first().commentId);
        const oldLastComm = state.get('lastComm');
        lastComm = !oldLastComm || Number(lastComm) > Number(oldLastComm) ?
            lastComm :
            oldLastComm;
        return state.merge({
            byId: state.get('byId').merge(newComments).sort(comparator),
            lastComm,
            newComments: new Map()
        });
    },

    [types.COMMENTS_MORE_ITERATOR]: (state, { parent }) =>
        state.setIn(['flags', 'fetchingMoreComments', parent], true),

    [types.COMMENTS_MORE_ITERATOR_ERROR]: (state, { request }) =>
        state.setIn(['flags', 'fetchingMoreComments', request.parent], false),

    [types.COMMENTS_MORE_ITERATOR_SUCCESS]: (state, { data, request }) => {
        if (!data.collection.length) {
            return state.setIn(['flags', 'fetchingMoreComments', request.parent], false);
        }
        const { byId, firstComm, lastComm } = iteratorHandler(state, data.collection);
        return state.merge({
            byId,
            firstComm: firstComm || null,
            flags: state.get('flags').setIn(['fetchingMoreComments', request.parent], false),
            lastComm: lastComm || null,
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
        return state.merge({
            byId: state.get('byId').setIn([commentId, 'content'], data.content),
            flags: state.get('flags').setIn(['resolvingComments', data.ipfsHash], false)
        });
    },

    // when requesting a new entry, clear comments in the store
    [types.ENTRY_GET_FULL]: () => initialState,
});

export default commentsState;

