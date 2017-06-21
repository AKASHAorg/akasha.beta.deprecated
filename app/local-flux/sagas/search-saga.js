import { take, put, call, apply, fork, takeEvery } from 'redux-saga/effects';
import * as actions from '../actions/search-actions';
import { actionChannels, enableChannel } from './helpers';
import * as types from '../constants';
import { searchLimit } from '../../constants/iterator-limits';

const Channel = global.Channel;
let searchHandshakeErrCount = 0;

function* searchQuery ({ text, pageSize = searchLimit, offset = 0 }) {
    const channel = Channel.server.search.query;
    yield call(enableChannel, channel, Channel.client.search.manager);
    yield apply(channel, channel.send, [{ text, pageSize, offset }]);
}

function* searchHandshake () {
    const channel = Channel.server.search.handshake;
    yield call(enableChannel, channel, Channel.client.search.manager);
    yield apply(channel, channel.send, [{}]);
}


// Action watchers

function* watchSearchQuery () {
    yield takeEvery(types.SEARCH_QUERY, searchQuery);
}

function* watchSearchMoreQuery () {
    yield takeEvery(types.SEARCH_MORE_QUERY, searchQuery);
}

function* watchSearchHandshake () {
    yield takeEvery(types.SEARCH_HANDSHAKE, searchHandshake);
}

// Channel watchers

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

function* watchSearchHandshakeChannel () {
    while (true) {
        const resp = yield take(actionChannels.search.handshake);
        if (resp.error) {
            if (searchHandshakeErrCount < 3) {
                searchHandshakeErrCount++;
                yield fork(searchHandshake);
            } else {
                searchHandshakeErrCount = 0;
                yield put(actions.searchHandshakeError());
            }
        } else {
            yield put(actions.searchHandshakeSuccess(resp.data, resp.request));
        }
    }
}

// exports

export function* registerSearchListeners () {
    yield fork(watchSearchHandshakeChannel);
    yield fork(watchSearchQueryChannel);
}

export function* watchSearchActions () { // eslint-disable-line max-statements
    yield fork(watchSearchQuery);
    yield fork(watchSearchMoreQuery);
    yield fork(watchSearchHandshake);
}

export function* registerWatchers () {
    yield fork(registerSearchListeners);
    yield fork(watchSearchActions);
}
