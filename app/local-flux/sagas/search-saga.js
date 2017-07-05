import { take, put, call, apply, fork, takeEvery } from 'redux-saga/effects';
import * as actions from '../actions/search-actions';
import { actionChannels, enableChannel } from './helpers';
import * as types from '../constants';
import { searchLimit } from '../../constants/iterator-limits';

const Channel = global.Channel;
let searchHandshakeErrCount = 0;
const MAX_RETRIES = 3;

function* searchHandshake () {
    const channel = Channel.server.search.handshake;
    yield call(enableChannel, channel, Channel.client.search.manager);
    yield apply(channel, channel.send, [{}]);
}

function* searchQuery ({ text, pageSize = searchLimit, offset = 0 }) {
    const channel = Channel.server.search.query;
    yield call(enableChannel, channel, Channel.client.search.manager);
    yield apply(channel, channel.send, [{ text, pageSize, offset }]);
}

// Action watchers

function* watchSearchHandshake () {
    yield takeEvery(types.SEARCH_HANDSHAKE, searchHandshake);
}

function* watchSearchMoreQuery () {
    yield takeEvery(types.SEARCH_MORE_QUERY, searchQuery);
}

function* watchSearchQuery () {
    yield takeEvery(types.SEARCH_QUERY, searchQuery);
}

// Channel watchers

function* watchSearchHandshakeChannel () {
    while (true) {
        const resp = yield take(actionChannels.search.handshake);
        if (resp.error) {
            if (searchHandshakeErrCount < MAX_RETRIES) {
                searchHandshakeErrCount++;
                yield fork(searchHandshake);
            } else {
                searchHandshakeErrCount = 0;
                yield put(actions.searchHandshakeError());
            }
        } else {
            searchHandshakeErrCount = 0;
            yield put(actions.searchHandshakeSuccess(resp.data, resp.request));
        }
    }
}

function* watchSearchQueryChannel () {
    while (true) {
        const resp = yield take(actionChannels.search.query);
        if (resp.error) {
            if (resp.request.offset) {
                yield put(actions.searchMoreQueryError(resp.error, resp.request));
            } else {
                yield put(actions.searchQueryError(resp.error, resp.request));
            }
        } else if (resp.request.offset) {
            yield put(actions.searchMoreQuerySuccess(resp.data, resp.request));
        } else {
            yield put(actions.searchQuerySuccess(resp.data, resp.request));
        }
    }
}

// exports

export function* registerSearchListeners () {
    yield fork(watchSearchHandshakeChannel);
    yield fork(watchSearchQueryChannel);
}

export function* watchSearchActions () {
    yield fork(watchSearchHandshake);
    yield fork(watchSearchMoreQuery);
    yield fork(watchSearchQuery);
}

export function* registerWatchers () {
    yield fork(registerSearchListeners);
    yield fork(watchSearchActions);
}