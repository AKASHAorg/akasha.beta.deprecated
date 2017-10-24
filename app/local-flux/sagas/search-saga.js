import { take, put, call, apply, fork, select, takeEvery, takeLatest } from 'redux-saga/effects';
import * as actions from '../actions/search-actions';
import { actionChannels, enableChannel } from './helpers';
import * as types from '../constants';
import { entrySearchLimit } from '../../constants/iterator-limits';
// import { entryGetExtraOfList } from './entry-saga';
import { selectSearchQuery } from '../selectors';
import * as searchService from '../services/search-service';

const Channel = global.Channel;
const SEARCH_TAGS_LIMIT = 5;

function* searchQuery ({ text, pageSize = entrySearchLimit, offset = 0 }) {
    const channel = Channel.server.search.query;
    yield call(enableChannel, channel, Channel.client.search.manager);
    yield apply(channel, channel.send, [{ text, pageSize, offset }]);
}

function* searchSyncTags () {
    const channel = Channel.server.search.syncTags;
    let fromBlock;
    try {
        fromBlock = yield apply(searchService, searchService.getLastBlock, ['tags']);
    } catch (error) {
        console.error('get last block error -', error);
    }
    fromBlock = fromBlock || 0;
    yield apply(channel, channel.send, [{ fromBlock }]);
}

function* searchTags ({ query }) {
    const channel = Channel.server.search.findTags;
    yield apply(channel, channel.send, [{ text: query, limit: SEARCH_TAGS_LIMIT }]);
}

function* searchUpdateLastBlock ({ type, blockNr }) {
    try {
        yield apply(searchService, searchService.updateLastBlock, [{ type, blockNr }]);
    } catch (error) {
        console.error('update last block error -', error);
    }
}

// Channel watchers

function* watchSearchQueryChannel () {
    /*
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
    */
}

function* watchSearchSyncTagsChannel () {
    while (true) {
        const resp = yield take(actionChannels.search.syncTags);
        if (resp.error) {
            yield put(actions.searchSyncTagsError(resp.error));
        } else if (resp.data.done) {
            const blockNr = resp.data.lastBlock;
            yield fork(searchUpdateLastBlock, { type: 'tags', blockNr });
        }
    }
}

function* watchSearchTagsChannel () {
    while (true) {
        const resp = yield take(actionChannels.search.findTags);
        const query = yield select(selectSearchQuery);
        if (resp.error) {
            yield put(actions.searchTagsError(resp.error));
        } else if (resp.data.collection && query === resp.request.text) {
            yield put(actions.searchTagsSuccess(resp.data.collection));
        }
    }
}

export function* registerSearchListeners () {
    yield fork(watchSearchQueryChannel);
    yield fork(watchSearchSyncTagsChannel);
    yield fork(watchSearchTagsChannel);
}

export function* watchSearchActions () {
    yield takeLatest(types.SEARCH_MORE_QUERY, searchQuery);
    yield takeLatest(types.SEARCH_QUERY, searchQuery);
    yield takeLatest(types.SEARCH_SYNC_TAGS, searchSyncTags);
    yield takeEvery(types.SEARCH_TAGS, searchTags);
}

export function* registerWatchers () {
    yield fork(registerSearchListeners);
    yield fork(watchSearchActions);
}
