import { take, put, call, apply, fork, takeLatest, select } from 'redux-saga/effects';
import * as actions from '../actions/search-actions';
import { actionChannels, enableChannel } from './helpers';
import * as types from '../constants';
import { entrySearchLimit } from '../../constants/iterator-limits';
import { entryGetExtraOfList } from './entry-saga';
import { selectSearchQuery } from '../selectors';

const Channel = global.Channel;
let searchHandshakeErrCount = 0;
const MAX_RETRIES = 3;

function* searchHandshake () {
    const channel = Channel.server.search.handshake;
    yield call(enableChannel, channel, Channel.client.search.manager);
    yield apply(channel, channel.send, [{}]);
}

function* searchQuery ({ text, pageSize = entrySearchLimit, offset = 0 }) {
    const channel = Channel.server.search.query;
    yield call(enableChannel, channel, Channel.client.search.manager);
    yield apply(channel, channel.send, [{ text, pageSize, offset }]);
}

// Action watchers

function* watchSearchHandshake () {
    yield takeLatest(types.SEARCH_HANDSHAKE, searchHandshake);
}

function* watchSearchMoreQuery () {
    yield takeLatest(types.SEARCH_MORE_QUERY, searchQuery);
}

function* watchSearchQuery () {
    yield takeLatest(types.SEARCH_QUERY, searchQuery);
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
    const listLimit = entrySearchLimit + 1;
    while (true) {
        const resp = yield take(actionChannels.search.query);
        const query = yield select(selectSearchQuery);
        if (resp.error) {
            if (resp.request.offset) {
                yield put(actions.searchMoreQueryError(resp.error, resp.request));
            } else {
                yield put(actions.searchQueryError(resp.error, resp.request));
            }
        } else if (resp.request.text === query) {
            if (resp.request.offset) {
                yield put(actions.searchMoreQuerySuccess(resp.data, resp.request));
                yield fork(entryGetExtraOfList, resp.data.collection, listLimit, 'search');
            } else {
                yield put(actions.searchQuerySuccess(resp.data, resp.request));
                yield fork(entryGetExtraOfList, resp.data.collection, listLimit, 'search');
            }
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
