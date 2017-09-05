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

function* tagSearch ({ tag, start = 0, limit = tagSearchLimit }) {
    try {
        const tags = yield apply(tagService, tagService.tagSearch, [tag, start, limit]);
        yield (start) ?
        put(actions.tagSearchMoreSuccess(tags.tags, tags.count)) :
        put(actions.tagSearchSuccess(tags.tags, tags.count));
        yield put(actions.tagGetEntriesCount(tags.tags.map(tagName => ({ tagName }))));
    } catch (error) {
        yield (start) ?
        put(actions.tagSearchMoreError(error)) :
        put(actions.tagSearchError(error));
    }
}
// intentionally left here...
function* tagsGetSuggestions ({ tag, start = 0, limit = tagSearchLimit }) {
    try {
        const response = yield call([tagService, tagService.tagSearch], tag.tag, start, limit);
        yield put(actions.tagSearchSuccess(response.tags, response.count));
    } catch (ex) {
        yield put(actions.tagSearchError(ex));
    }
}
// Action watchers

function* watchTagGetEntriesCount () {
    yield takeEvery(types.TAG_GET_ENTRIES_COUNT, tagGetEntriesCount);
}

function* watchTagIterator () {
    yield take(types.TAG_ITERATOR);
    tagFetchAllTask = yield fork(tagIterator);
}

function* watchTagSave () {
    yield takeEvery(types.TAG_SAVE, tagSave);
}

function* watchTagSearch () {
    yield takeLatest(types.TAG_SEARCH, (action) => {
        const { tag } = action;
        if (tag.localOnly) {
            return tagsGetSuggestions(action);
        }
        return tagSearch(action);
    });
}

function* watchTagSearchMore () {
    yield takeLatest(types.TAG_SEARCH_MORE, tagSearch);
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

// function* watchTagSearchChannel () {
//     while (true) {
//         const resp = yield take(actionChannels.tags.searchTag);
//         if (resp.error) {
//             yield put(actions.tagSearchError(resp.error));
//         } else {
//             yield put(actions.tagSearchSuccess(resp.data));
//             yield put(actions.tagGetEntriesCount(resp.data.collection.map(tagName => ({ tagName }))));
//         }
//     }
// }

export function* registerTagListeners () {
    yield fork(watchTagGetEntriesCountChannel);
    yield fork(watchTagIteratorChannel);
}

export function* watchTagActions () {
    yield fork(watchTagGetEntriesCount);
    yield fork(watchTagIterator);
    yield fork(watchTagSave);
    yield fork(watchTagSearch);
    yield fork(watchTagSearchMore);
}
