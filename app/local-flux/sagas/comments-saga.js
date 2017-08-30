import { apply, call, fork, put, select, take, takeEvery } from 'redux-saga/effects';
import { actionChannels, enableChannel } from './helpers';
import * as actionActions from '../actions/action-actions';
import * as actions from '../actions/comments-actions';
import * as types from '../constants';
import * as actionStatus from '../../constants/action-status';
import { selectFirstComment, selectLastComment, selectToken } from '../selectors';

const Channel = global.Channel;

function* commentsCheckNew ({ entryId }) {
    const start = yield select(selectLastComment);
    yield call(commentsIterator, { entryId, start, reverse: true, checkNew: true }); // eslint-disable-line
}

function* commentsGetCount ({ entryId }) {
    const channel = Channel.server.comments.commentsCount;
    yield call(enableChannel, channel, Channel.client.comments.manager);
    yield apply(channel, channel.send, [{ entryId }]);
}

function* commentsIterator ({ entryId, start, limit = 25, reverse, checkNew }) {
    const channel = Channel.server.comments.commentsIterator;
    yield call(enableChannel, channel, Channel.client.comments.manager);
    yield apply(channel, channel.send, [{ entryId, start, limit, reverse, checkNew }]);
}

function* commentsMoreIterator ({ entryId }) {
    const start = yield select(selectFirstComment);
    yield call(commentsIterator, { entryId, start });
}

function* commentsPublish ({ actionId, ...payload }) {
    const channel = Channel.server.comments.comment;
    yield call(enableChannel, channel, Channel.client.comments.manager);
    const token = yield select(selectToken);
    yield apply(channel, channel.send, [{ actionId, token, ...payload }]);
}

function* commentsPublishSuccess ({ data }) {
    const entry = yield select(state => state.entryState.get('fullEntry'));
    if (!entry || entry.get('entryId') !== data.entryId) {
        return;
    }
    const lastComm = yield select(selectLastComment);
    yield put(actions.commentsIterator(entry.get('entryId'), 25, lastComm, true));
}

// Action watchers

function* watchCommentsCheckNew () {
    yield takeEvery(types.COMMENTS_CHECK_NEW, commentsCheckNew);
}

function* watchCommentsGetCount () {
    yield takeEvery(types.COMMENTS_GET_COUNT, commentsGetCount);
}

function* watchCommentsIterator () {
    yield takeEvery(types.COMMENTS_ITERATOR, commentsIterator);
}

function* watchCommentsMoreIterator () {
    yield takeEvery(types.COMMENTS_MORE_ITERATOR, commentsMoreIterator);
}

function* watchCommentsPublish () {
    yield takeEvery(types.COMMENTS_PUBLISH, commentsPublish);
}

function* watchCommentsPublishSuccess () {
    yield takeEvery(types.COMMENTS_PUBLISH_SUCCESS, commentsPublishSuccess);
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
            } else if (resp.request.start) {
                yield put(actions.commentsMoreIteratorError(resp.error));
            } else {
                yield put(actions.commentsIteratorError(resp.error));
            }
        } else if (resp.request.checkNew) {
            const byId = yield select(state => state.commentsState.get('byId'));
            const loggedProfile = yield select(state =>
                state.profileState.getIn(['loggedProfile', 'profile']));
            resp.data.collection = resp.data.collection.filter((comm) => {
                const { parent, profile } = comm.data;
                const isOwnComm = profile && profile.profile === loggedProfile;
                const isParentLoaded = parent === '0' || byId.get(parent);
                if (!isOwnComm && isParentLoaded) {
                    return true;
                }
                return false;
            });
            yield put(actions.commentsCheckNewSuccess(resp.data, resp.request));
        } else if (resp.request.start) {
            yield put(actions.commentsMoreIteratorSuccess(resp.data, resp.request));
        } else {
            yield put(actions.commentsIteratorSuccess(resp.data, resp.request));
        }
    }
}

function* watchCommentsPublishChannel () {
    while (true) {
        const resp = yield take(actionChannels.comments.comment);
        const { actionId } = resp.request;
        if (resp.error) {
            yield put(actions.commentsPublishError(resp.error));
        } else {
            const changes = { id: actionId, status: actionStatus.publishing, tx: resp.data.tx };
            yield put(actionActions.actionUpdate(changes));
        }
    }
}

export function* registerCommentsListeners () {
    yield fork(watchCommentsGetCountChannel);
    yield fork(watchCommentsIteratorChannel);
    yield fork(watchCommentsPublishChannel);
}

export function* watchCommentsActions () {
    yield fork(watchCommentsCheckNew);
    yield fork(watchCommentsGetCount);
    yield fork(watchCommentsIterator);
    yield fork(watchCommentsMoreIterator);
    yield fork(watchCommentsPublish);
    yield fork(watchCommentsPublishSuccess);
}

export function* registerWatchers () {
    yield fork(registerCommentsListeners);
    yield fork(watchCommentsActions);
}
