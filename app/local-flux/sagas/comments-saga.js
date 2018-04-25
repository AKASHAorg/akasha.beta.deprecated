import { apply, call, fork, put, select, take, takeEvery } from 'redux-saga/effects';
import { actionChannels, enableChannel, isLoggedProfileRequest } from './helpers';
import * as actionActions from '../actions/action-actions';
import * as actions from '../actions/comments-actions';
import * as appActions from '../actions/app-actions';
import * as profileActions from '../actions/profile-actions';
import * as types from '../constants';
import * as actionStatus from '../../constants/action-status';
import { selectBlockNumber, selectCommentLastBlock, selectCommentLastIndex, selectLoggedEthAddress,
    selectNewCommentsBlock, selectNewestCommentBlock, selectToken, selectFullEntry } from '../selectors';

const Channel = global.Channel;
const COMMENT_FETCH_LIMIT = 50;
const REPLIES_FETCH_LIMIT = 25;

function* commentsCheckNew ({ entryId }) {
    const toBlock = yield select(selectNewCommentsBlock);
    yield call(commentsIterator, { entryId, toBlock, reversed: true, checkNew: true }); // eslint-disable-line
}

function* commentsDownvote ({ actionId, commentId, entryId, weight }) {
    const channel = Channel.server.comments.downvote;
    yield call(enableChannel, channel, Channel.client.comments.manager);
    const token = yield select(selectToken);
    yield apply(
        channel,
        channel.send,
        [{ actionId, token, commentId, entryId, weight }]
    );
}

function* commentsDownvoteSuccess ({ data }) {
    yield call(commentsVoteSuccess, data.commentId); // eslint-disable-line no-use-before-define
    yield put(appActions.showNotification({ id: 'downvoteCommentSuccess', duration: 4 }));
}

function* getComment (entryId, commentId) {
    const channel = Channel.server.comments.getComment;
    yield call(enableChannel, channel, Channel.client.comments.manager);
    yield apply(channel, channel.send, [{ entryId, commentId }]);
}

function* commentsGetCount ({ entryId }) {
    const channel = Channel.server.comments.commentsCount;
    yield call(enableChannel, channel, Channel.client.comments.manager);
    yield apply(channel, channel.send, [{ entryId }]);
}

function* commentsGetExtra (collection, request) {
    const loggedEthAddress = yield select(selectLoggedEthAddress);
    const commentIds = [];
    const ethAddresses = [];
    const ipfsHashes = [];
    const voteOf = [];
    collection.forEach((comment) => {
        const { ethAddress } = comment.author;
        if (!ethAddresses.includes(ethAddress)) {
            ethAddresses.push(ethAddress);
        }
        ipfsHashes.push(comment.ipfsHash);
        commentIds.push(comment.commentId);
        voteOf.push({ commentId: comment.commentId, ethAddress: loggedEthAddress });
    });
    if (ipfsHashes.length) {
        yield put(actions.commentsResolveIpfsHash(ipfsHashes, commentIds));
        yield put(actions.commentsGetVoteOf(voteOf));
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

function* commentsGetScore ({ commentId }) {
    const channel = Channel.server.comments.getScore;
    yield call(enableChannel, channel, Channel.client.comments.manager);
    yield apply(channel, channel.send, [{ commentId }]);
}

function* commentsGetVoteOf ({ data }) {
    const channel = Channel.server.comments.getVoteOf;
    yield call(enableChannel, channel, Channel.client.comments.manager);
    yield apply(channel, channel.send, [data]);
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

function* commentsPublishSuccess () {
    yield put(appActions.showNotification({ id: 'publishCommentSuccess', duration: 4 }));
}

function* commentsResolveIpfsHash ({ ipfsHashes, commentIds }) {
    const channel = Channel.server.comments.resolveCommentsIpfsHash;
    yield call(enableChannel, channel, Channel.client.comments.manager);
    yield apply(channel, channel.send, [ipfsHashes, commentIds]);
}

function* commentsUpvote ({ actionId, commentId, entryId, weight }) {
    const channel = Channel.server.comments.upvote;
    yield call(enableChannel, channel, Channel.client.comments.manager);
    const token = yield select(selectToken);
    yield apply(
        channel,
        channel.send,
        [{ actionId, token, commentId, entryId, weight }]
    );
}

function* commentsUpvoteSuccess ({ data }) {
    yield call(commentsVoteSuccess, data.commentId); // eslint-disable-line no-use-before-define
    yield put(appActions.showNotification({ id: 'upvoteCommentSuccess', duration: 4 }));
}

function* commentsVoteSuccess (commentId) {
    const ethAddress = yield select(selectLoggedEthAddress);
    yield put(actions.commentsGetScore(commentId));
    yield put(actions.commentsGetVoteOf([{ commentId, ethAddress }]));
}

// Channel watchers

function* watchCommentsDownvoteChannel () {
    while (true) {
        const resp = yield take(actionChannels.comments.downvote);
        const { actionId } = resp.request;
        const shouldApplyChanges = yield call(isLoggedProfileRequest, actionId);
        if (shouldApplyChanges) {
            if (resp.error) {
                yield put(actions.commentsDownvoteError(resp.error, resp.request));
                yield put(actionActions.actionDelete(actionId));
            } else if (resp.data.receipt) {
                yield put(actionActions.actionPublished(resp.data.receipt));
                if (!resp.data.receipt.success) {
                    yield put(actions.commentsDownvoteError({}, resp.request));
                }
            } else {
                const changes = { id: actionId, status: actionStatus.publishing, tx: resp.data.tx };
                yield put(actionActions.actionUpdate(changes));
            }
        }
    }
}

function* watchCommentsGetCommentChannel () {
    while (true) {
        const resp = yield take(actionChannels.comments.getComment);
        if (resp.error) {
            yield put(actions.commentsGetCommentError(resp.error));
        } else {
            yield put(actions.commentsGetCommentSuccess(resp.data, resp.request));
        }
    }
}

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

function* watchCommentsGetScoreChannel () {
    while (true) {
        const resp = yield take(actionChannels.comments.getScore);
        if (resp.error) {
            yield put(actions.commentsGetScoreError(resp.error));
        } else {
            yield put(actions.commentsGetScoreSuccess(resp.data));
        }
    }
}

function* watchCommentsGetVoteOfChannel () {
    while (true) {
        const resp = yield take(actionChannels.comments.getVoteOf);
        if (resp.error) {
            yield put(actions.commentsGetVoteOfError(resp.error));
        } else {
            yield put(actions.commentsGetVoteOfSuccess(resp.data));
        }
    }
}

function* watchCommentsIteratorChannel () { // eslint-disable-line max-statements
    while (true) {
        const resp = yield take(actionChannels.comments.commentsIterator);
        const fullEntry = yield select(selectFullEntry);
        if (!fullEntry || resp.request.entryId !== fullEntry.entryId) {
            continue; // eslint-disable-line no-continue
        }
        if (resp.error) {
            if (resp.request.checkNew) {
                yield put(actions.commentsCheckNewError(resp.error));
            } else if (resp.request.more) {
                yield put(actions.commentsMoreIteratorError(resp.error, resp.request));
            } else {
                yield put(actions.commentsIteratorError(resp.error, resp.request));
            }
        } else if (resp.request.checkNew) {
            const collection = [];
            const loggedEthAddress = yield select(selectLoggedEthAddress);
            resp.data.collection.forEach((comm) => {
                if (comm.author.ethAddress !== loggedEthAddress) {
                    collection.push(comm);
                }
            });
            resp.data.collection = collection;
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
        const shouldApplyChanges = yield call(isLoggedProfileRequest, actionId);
        if (shouldApplyChanges) {
            if (resp.error) {
                yield put(actions.commentsPublishError(resp.error));
            } else if (resp.data.receipt) {
                yield put(actionActions.actionPublished(resp.data.receipt));
                if (resp.data.entryId && resp.data.commentId) {
                    yield fork(getComment, resp.data.entryId, resp.data.commentId);
                }
                if (!resp.data.receipt.success) {
                    yield put(actions.commentsPublishError({}));
                }
            } else {
                const changes = { id: actionId, status: actionStatus.publishing, tx: resp.data.tx };
                yield put(actionActions.actionUpdate(changes));
            }
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

function* watchCommentsUpvoteChannel () {
    while (true) {
        const resp = yield take(actionChannels.comments.upvote);
        const { actionId } = resp.request;
        const shouldApplyChanges = yield call(isLoggedProfileRequest, actionId);
        if (shouldApplyChanges) {
            if (resp.error) {
                yield put(actions.commentsUpvoteError(resp.error, resp.request));
                yield put(actionActions.actionDelete(actionId));
            } else if (resp.data.receipt) {
                yield put(actionActions.actionPublished(resp.data.receipt));
                if (!resp.data.receipt.success) {
                    yield put(actions.commentsUpvoteError({}, resp.request));
                }
            } else {
                const changes = { id: actionId, status: actionStatus.publishing, tx: resp.data.tx };
                yield put(actionActions.actionUpdate(changes));
            }
        }
    }
}

export function* registerCommentsListeners () {
    yield fork(watchCommentsDownvoteChannel);
    yield fork(watchCommentsGetCommentChannel);
    yield fork(watchCommentsGetCountChannel);
    yield fork(watchCommentsGetScoreChannel);
    yield fork(watchCommentsGetVoteOfChannel);
    yield fork(watchCommentsIteratorChannel);
    yield fork(watchCommentsPublishChannel);
    yield fork(watchCommentsResolveIpfsHashChannel);
    yield fork(watchCommentsUpvoteChannel);
}

export function* watchCommentsActions () {
    yield takeEvery(types.COMMENTS_DOWNVOTE, commentsDownvote);
    yield takeEvery(types.COMMENTS_DOWNVOTE_SUCCESS, commentsDownvoteSuccess);
    yield takeEvery(types.COMMENTS_CHECK_NEW, commentsCheckNew);
    yield takeEvery(types.COMMENTS_GET_COUNT, commentsGetCount);
    yield takeEvery(types.COMMENTS_GET_SCORE, commentsGetScore);
    yield takeEvery(types.COMMENTS_GET_VOTE_OF, commentsGetVoteOf);
    yield takeEvery(types.COMMENTS_ITERATOR, commentsIterator);
    yield takeEvery(types.COMMENTS_MORE_ITERATOR, commentsMoreIterator);
    yield takeEvery(types.COMMENTS_PUBLISH, commentsPublish);
    yield takeEvery(types.COMMENTS_PUBLISH_SUCCESS, commentsPublishSuccess);
    yield takeEvery(types.COMMENTS_RESOLVE_IPFS_HASH, commentsResolveIpfsHash);
    yield takeEvery(types.COMMENTS_UPVOTE, commentsUpvote);
    yield takeEvery(types.COMMENTS_UPVOTE_SUCCESS, commentsUpvoteSuccess);
}

export function* registerWatchers () {
    yield fork(registerCommentsListeners);
    yield fork(watchCommentsActions);
}
