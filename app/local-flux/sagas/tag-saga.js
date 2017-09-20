import { apply, call, cancel, fork, put, select, take, takeEvery, takeLatest } from 'redux-saga/effects';
import * as reduxSaga from 'redux-saga';
import { actionChannels, enableChannel } from './helpers';
import { selectTagMargins } from '../selectors';
import * as actions from '../actions/tag-actions';
import * as tagService from '../services/tag-service';
import * as types from '../constants';
import { tagSearchLimit } from '../../constants/iterator-limits';

const Channel = global.Channel;
const TAG_LIMIT = 30;
const TAG_SEARCH_LIMIT = 10;
let tagFetchAllTask;

function* cancelTagIterator () {
    if (tagFetchAllTask) {
        yield cancel(tagFetchAllTask);
        tagFetchAllTask = null;
    }
}

function* tagGetEntriesCount ({ tags }) {
    const channel = Channel.server.entry.getTagEntriesCount;
    yield call(enableChannel, channel, Channel.client.entry.manager);
    yield apply(channel, channel.send, [tags]);
}

function* tagIterator () {
    const channel = Channel.server.tags.tagIterator;
    yield call(enableChannel, channel, Channel.client.tags.manager);
    while (true) {
        const margins = yield select(selectTagMargins);
        // first get the older tags (until the first created tag), then fetch newest
        const start = margins.get('firstTag') === '1' ? null : margins.get('firstTag');
        yield apply(channel, channel.send, [{ start, limit: TAG_LIMIT }]);
        yield apply(reduxSaga, reduxSaga.delay, [2000]);
    }
}

export function* tagGetMargins () {
    try {
        const margins = yield apply(tagService, tagService.getTagMargins);
        yield put(actions.tagGetMarginsSuccess(margins));
        yield put(actions.tagIterator());
    } catch (error) {
        yield put(actions.tagGetMarginsError(error));
    }
}

function* tagSave ({ data }) {
    try {
        const margins = yield apply(tagService, tagService.saveTags, [data]);
        yield put(actions.tagSaveSuccess(margins));
    } catch (error) {
        yield put(actions.tagSaveError(error));
        yield call(cancelTagIterator);
    }
}

function* tagSearch ({ tagName }) {
    const channel = Channel.server.tags.searchTag;
    yield call(enableChannel, channel, Channel.client.tags.manager);
    yield apply(channel, channel.send, [{ tagName, limit: TAG_SEARCH_LIMIT }]);
}

function* tagSearchLocal ({ tag, start = 0, limit = tagSearchLimit }) {
    try {
        const tags = yield apply(tagService, tagService.tagSearch, [tag, start, limit]);
        yield (start) ?
        put(actions.tagSearchLocalMoreSuccess(tags.tags, tags.count)) :
        put(actions.tagSearchLocalSuccess(tags.tags, tags.count));
        yield put(actions.tagGetEntriesCount(tags.tags.map(tagName => ({ tagName }))));
    } catch (error) {
        yield (start) ?
        put(actions.tagSearchLocalMoreError(error)) :
        put(actions.tagSearchLocalError(error));
    }
}

// Action watchers

function* watchTagIterator () {
    yield take(types.TAG_ITERATOR);
    tagFetchAllTask = yield fork(tagIterator);
}

// Channel watchers

function* watchTagGetEntriesCountChannel () {
    while (true) {
        const resp = yield take(actionChannels.entry.getTagEntriesCount);
        if (resp.error) {
            yield put(actions.tagGetEntriesCountError(resp.error));
        } else {
            yield put(actions.tagGetEntriesCountSuccess(resp.data));
        }
    }
}

function* watchTagIteratorChannel () {
    while (true) {
        const resp = yield take(actionChannels.tags.tagIterator);
        const { data, error } = resp;
        if (error) {
            yield put(actions.tagIteratorError(error));
            yield call(cancelTagIterator);
        } else if (data.collection && data.collection.length) {
            const margins = yield select(selectTagMargins);
            const newestTag = data.collection[0].tagId;
            const noNewTags = margins.get('firstTag') === '1' &&
                Number(newestTag) <= Number(margins.get('lastTag'));
            if (noNewTags) {
                yield call(cancelTagIterator);
            } else {
                yield put(actions.tagSave(resp.data));
            }
        }
    }
}

function* watchTagSearchChannel () {
    while (true) {
        const resp = yield take(actionChannels.tags.searchTag);
        if (resp.error) {
            yield put(actions.tagSearchError(resp.error));
        } else {
            const query = yield select(state => state.tagState.get('searchQuery'));
            console.log('query', query);
            console.log('tagName', resp.request.tagName);
            if (query === resp.request.tagName) {
                console.log('data', resp.data);
                yield put(actions.tagSearchSuccess(resp.data.collection));
                yield put(actions.tagGetEntriesCount(resp.data.collection.map(tagName => ({ tagName }))));
            }
        }
    }
}

export function* registerTagListeners () {
    yield fork(watchTagGetEntriesCountChannel);
    yield fork(watchTagIteratorChannel);
    yield fork(watchTagSearchChannel);
}

export function* watchTagActions () {
    yield takeEvery(types.TAG_GET_ENTRIES_COUNT, tagGetEntriesCount);
    yield fork(watchTagIterator);
    yield takeEvery(types.TAG_SAVE, tagSave);
    yield takeLatest(types.TAG_SEARCH, tagSearch);
    yield takeLatest(types.TAG_SEARCH_LOCAL, tagSearchLocal);
    yield takeLatest(types.TAG_SEARCH_LOCAL_MORE, tagSearchLocal);
}
