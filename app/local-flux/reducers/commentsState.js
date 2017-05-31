import { Map } from 'immutable';
import * as types from '../constants';
import * as appTypes from '../constants/AppConstants';
import { createReducer } from './create-reducer';
import { CommentData, CommentRecord, CommentsState } from './records';

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

const getCommentRecord = (comment) => {
    let record = new CommentRecord(comment);
    record = record.set('data', new CommentData(comment.data));
    if (comment.data.profile) {
        record = record.setIn(['data', 'profile'], comment.data.profile.akashaId);
    }
    if (comment.data.content) {
        record = record.setIn(['data', 'content'], JSON.parse(comment.data.content));
    }
    return record;
};

const iteratorHandler = (state, collection) => {
    let byId = state.get('byId');
    let firstComm = collection[collection.length - 1].commentId;
    let lastComm = collection[0].commentId;
    const oldMargins = { firstComm: state.get('firstComm'), lastComm: state.get('lastComm') };
    collection.forEach((comm) => {
        byId = byId.set(comm.commentId, getCommentRecord(comm));
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
    [appTypes.CLEAN_STORE]: () => initialState,

    // *************** NEW REDUCERS **********************

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

    [types.COMMENTS_ITERATOR]: state =>
        state.setIn(['flags', 'fetchingComments'], true),

    [types.COMMENTS_ITERATOR_ERROR]: state =>
        state.setIn(['flags', 'fetchingComments'], false),

    [types.COMMENTS_ITERATOR_SUCCESS]: (state, { data, request }) => {
        if (!data.collection.length) {
            return state.setIn(['flags', 'fetchingComments'], false);
        }
        const { byId, firstComm, lastComm } = iteratorHandler(state, data.collection);
        return state.merge({
            byId,
            firstComm: firstComm || null,
            flags: state.get('flags').set('fetchingComments', false),
            lastComm: lastComm || null,
            moreComments: data.collection.length === request.limit
        });
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

    [types.COMMENTS_MORE_ITERATOR]: state =>
        state.setIn(['flags', 'fetchingMoreComments'], true),

    [types.COMMENTS_MORE_ITERATOR_ERROR]: state =>
        state.setIn(['flags', 'fetchingMoreComments'], false),

    [types.COMMENTS_MORE_ITERATOR_SUCCESS]: (state, { data, request }) => {
        if (!data.collection.length) {
            return state.setIn(['flags', 'fetchingMoreComments'], false);
        }
        const { byId, firstComm, lastComm } = iteratorHandler(state, data.collection);
        return state.merge({
            byId,
            firstComm: firstComm || null,
            flags: state.get('flags').set('fetchingMoreComments', false),
            lastComm: lastComm || null,
            moreComments: data.collection.length === request.limit
        });
    },

    // when requesting a new entry, clear comments in the store
    [types.ENTRY_GET_FULL]: () => initialState,
});

export default commentsState;

