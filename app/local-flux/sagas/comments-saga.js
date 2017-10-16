import { apply, call, fork, put, select, take, takeEvery } from 'redux-saga/effects';
import { actionChannels, enableChannel } from './helpers';
import * as actionActions from '../actions/action-actions';
import * as actions from '../actions/comments-actions';
import * as profileActions from '../actions/profile-actions';
import * as types from '../constants';
import * as actionStatus from '../../constants/action-status';
import { selectBlockNumber, selectCommentLastBlock, selectCommentLastIndex, selectNewCommentsBlock,
    selectNewestCommentBlock, selectToken } from '../selectors';

const Channel = global.Channel;
const COMMENT_FETCH_LIMIT = 5;
const REPLIES_FETCH_LIMIT = 5;

function* commentsCheckNew ({ entryId }) {
    const toBlock = yield select(selectNewCommentsBlock);
    console.log('to block', toBlock);
    yield call(commentsIterator, { entryId, toBlock, reversed: true, checkNew: true }); // eslint-disable-line
}

function* commentsGetCount ({ entryId }) {
    const channel = Channel.server.comments.commentsCount;
    yield call(enableChannel, channel, Channel.client.comments.manager);
    yield apply(channel, channel.send, [{ entryId }]);
}

function* commentsGetExtra (collection, request) {
    const commentIds = [];
    const ethAddresses = [];
    const ipfsHashes = [];
    collection.forEach((comment) => {
        const { ethAddress } = comment.author;
        if (!ethAddresses.includes(ethAddress)) {
            ethAddresses.push(ethAddress);
        }
        ipfsHashes.push(comment.ipfsHash);
        commentIds.push(comment.commentId);
    });
    if (ipfsHashes.length) {
        yield put(actions.commentsResolveIpfsHash(ipfsHashes, commentIds));
    }
    for (let i = 0; i < ethAddresses.length; i++) {
        yield put(profileActions.profileGetData({ ethAddress: ethAddresses[i] }));
    }
    const { entryId, parent } = request;
    if (parent === '0') {
        for (let i = 0; i < commentIds.length; i++) {
            yield put(actions.commentsIterator({ entryId, parent: commentIds[i] }));
        }
    }
}

function* commentsIterator ({ entryId, parent, reversed, toBlock, more, checkNew }) {
    const channel = Channel.server.comments.commentsIterator;
    yield call(enableChannel, channel, Channel.client.comments.manager);
    let block;
    if (toBlock) {
        block = toBlock;
    } else {
        block = yield select(selectBlockNumber);
    }
    const limit = parent === '0' ? COMMENT_FETCH_LIMIT : REPLIES_FETCH_LIMIT;
    const lastIndex = reversed ? '0' : undefined;
    yield apply(
        channel,
        channel.send,
        [{ entryId, toBlock: block, lastIndex, limit, reversed, parent, more, checkNew }]
    );
}

function* commentsMoreIterator ({ entryId, parent }) {
    const channel = Channel.server.comments.commentsIterator;
    const toBlock = yield select(state => selectCommentLastBlock(state, parent));
    const lastIndex = yield select(state => selectCommentLastIndex(state, parent));
    yield apply(
        channel,
        channel.send,
        [{ entryId, toBlock, lastIndex, limit: COMMENT_FETCH_LIMIT, parent, more: true }]
    );
}

function* commentsPublish ({ actionId, ...payload }) {
    const channel = Channel.server.comments.comment;
    yield call(enableChannel, channel, Channel.client.comments.manager);
    const token = yield select(selectToken);
    yield apply(channel, channel.send, [{ actionId, token, ...payload }]);
}

function* commentsPublishSuccess ({ data }) {
    const { entryId, parent } = data;
    const entry = yield select(state => state.entryState.get('fullEntry'));
    if (!entry || entry.get('entryId') !== entryId) {
        return;
    }
    const toBlock = yield select(state => selectNewestCommentBlock(state, parent));
    yield fork(commentsIterator, { entryId, toBlock, parent, reversed: true });
}

function* commentsResolveIpfsHash ({ ipfsHashes, commentIds }) {
    const channel = Channel.server.comments.resolveCommentsIpfsHash;
    yield call(enableChannel, channel, Channel.client.comments.manager);
    yield apply(channel, channel.send, [ipfsHashes, commentIds]);
}

// Channel watchers

function* watchCommentsGetCountChannel () {
    while (true) {
        const resp = yield take(actionChannels.comments.commentsCount);
        if (resp.error) {
            yield put(actions.commentsGetCountError(resp.error));
        } else {
            yield put(actions.commentsGetCountSuccess(resp.data));
        }
    }
}

function* watchCommentsIteratorChannel () {
    while (true) {
        const resp = yield take(actionChannels.comments.commentsIterator);
        if (resp.error) {
            if (resp.request.checkNew) {
                yield put(actions.commentsCheckNewError(resp.error));
            } else if (resp.request.more) {
                yield put(actions.commentsMoreIteratorError(resp.error, resp.request));
            } else {
                yield put(actions.commentsIteratorError(resp.error, resp.request));
            }
        } else if (resp.request.checkNew) {
            yield fork(commentsGetExtra, resp.data.collection, resp.request);
            yield put(actions.commentsCheckNewSuccess(resp.data, resp.request));
        } else if (resp.request.reversed) {
            yield fork(commentsGetExtra, resp.data.collection, resp.request);
            yield put(actions.commentsIteratorReversedSuccess(resp.data, resp.request));
            // const byId = yield select(state => state.commentsState.get('byId'));
            // const loggedProfile = yield select(state =>
            //     state.profileState.getIn(['loggedProfile', 'profile']));
            // resp.data.collection = resp.data.collection.filter((comm) => {
            //     const { parent, profile } = comm.data;
            //     const isOwnComm = profile && profile.profile === loggedProfile;
            //     const isParentLoaded = parent === '0' || byId.get(parent);
            //     if (!isOwnComm && isParentLoaded) {
            //         return true;
            //     }
            //     return false;
            // });
            // yield put(actions.commentsCheckNewSuccess(resp.data, resp.request));
        } else {
            yield fork(commentsGetExtra, resp.data.collection, resp.request);
            if (resp.request.more) {
                yield put(actions.commentsMoreIteratorSuccess(resp.data, resp.request));
            } else {
                yield put(actions.commentsIteratorSuccess(resp.data, resp.request));
            }
        }
    }
}

function* watchCommentsPublishChannel () {
    while (true) {
        const resp = yield take(actionChannels.comments.comment);
        const { actionId } = resp.request;
        if (resp.error) {
            yield put(actions.commentsPublishError(resp.error));
        } else if (resp.data.receipt) {
            yield put(actionActions.actionPublished(resp.data.receipt));
            if (!resp.data.receipt.success) {
                yield put(actions.commentsPublishError({}));
            }
        } else {
            const changes = { id: actionId, status: actionStatus.publishing, tx: resp.data.tx };
            yield put(actionActions.actionUpdate(changes));
        }
    }
}

function* watchCommentsResolveIpfsHashChannel () {
    while (true) {
        const resp = yield take(actionChannels.comments.resolveCommentsIpfsHash);
        if (resp.error) {
            yield put(actions.commentsResolveIpfsHashError(resp.error));
        } else {
            yield put(actions.commentsResolveIpfsHashSuccess(resp.data));
        }
    }
}

export function* registerCommentsListeners () {
    yield fork(watchCommentsGetCountChannel);
    yield fork(watchCommentsIteratorChannel);
    yield fork(watchCommentsPublishChannel);
    yield fork(watchCommentsResolveIpfsHashChannel);
}

export function* watchCommentsActions () {
    yield takeEvery(types.COMMENTS_CHECK_NEW, commentsCheckNew);
    yield takeEvery(types.COMMENTS_GET_COUNT, commentsGetCount);
    yield takeEvery(types.COMMENTS_ITERATOR, commentsIterator);
    yield takeEvery(types.COMMENTS_MORE_ITERATOR, commentsMoreIterator);
    yield takeEvery(types.COMMENTS_PUBLISH, commentsPublish);
    yield takeEvery(types.COMMENTS_PUBLISH_SUCCESS, commentsPublishSuccess);
    yield takeEvery(types.COMMENTS_RESOLVE_IPFS_HASH, commentsResolveIpfsHash);
}

export function* registerWatchers () {
    yield fork(registerCommentsListeners);
    yield fork(watchCommentsActions);
}
