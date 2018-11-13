import { take, put, call, apply, fork, select, takeEvery, takeLatest } from 'redux-saga/effects';
import * as profileActions from '../actions/profile-actions';
import * as actions from '../actions/search-actions';
import * as tagActions from '../actions/tag-actions';
import { actionChannels, enableChannel } from './helpers';
import * as types from '../constants';
import { SEARCH } from '../../constants/context-types';
import { entrySearchLimit, profileAutocompleteLimit as autocompleteLimit,
    profileSearchLimit, tagSearchLimit } from '../../constants/iterator-limits';
import { entryGetExtraOfList } from './entry-saga';
import { selectSearchEntryOffset, selectSearchQuery, selectSearchQueryAutocomplete,
    selectLoggedEthAddress } from '../selectors';
import * as searchService from '../services/search-service';

const Channel = global.Channel;

function* searchMoreQuery () {
    const channel = Channel.server.search.query;
    const text = yield select(selectSearchQuery);
    const offset = yield select(selectSearchEntryOffset);
    yield apply(channel, channel.send, [{ text, pageSize: entrySearchLimit, offset }]);
}

function* searchQuery ({ text }) {
    const channel = Channel.server.search.query;
    if (text.length) {
        yield call(enableChannel, channel, Channel.client.search.manager);
        yield apply(channel, channel.send, [{ text, pageSize: entrySearchLimit }]);
    }
}

function* searchProfiles ({ query, autocomplete }) {
    const channel = Channel.server.search.findProfiles;
    const limit = autocomplete ? autocompleteLimit : profileSearchLimit;
    if (query.length) {
        yield apply(channel, channel.send, [{ text: query.toLowerCase(), limit, autocomplete }]);
    }
}

function* searchSyncEntries ({ following }) {
    const channel = Channel.server.search.syncEntries;
    const ethAddress = yield select(selectLoggedEthAddress);
    if (ethAddress) {
        let fromBlock;
        try {
            fromBlock = yield apply(searchService, searchService.getLastEntriesBlock, [ethAddress]);
        } catch (error) {
            console.error('get last entries block error -', error);
            console.error('for ethAddress', ethAddress);
        }
        yield apply(channel, channel.send, [{ fromBlock, following }]);
    }
}

function* searchSyncTags () {
    const channel = Channel.server.search.syncTags;
    let fromBlock;
    try {
        fromBlock = yield apply(searchService, searchService.getLastTagsBlock, ['tags']);
    } catch (error) {
        console.error('get last tags block error -', error);
    }
    fromBlock = fromBlock || 0;
    yield apply(channel, channel.send, [{ fromBlock }]);
}

function* searchTags ({ query, autocomplete }) {
    const channel = Channel.server.search.findTags;
    const limit = autocomplete ? autocompleteLimit : tagSearchLimit;
    if (query.length) {
        yield apply(channel, channel.send, [{ text: query.toLowerCase(), limit, autocomplete }]);
    }
}

function* searchUpdateLastEntriesBlock ({ ethAddress, blockNr }) {
    try {
        yield apply(searchService, searchService.updateLastEntriesBlock, [{ ethAddress, blockNr }]);
    } catch (error) {
        console.error('update last entries block error -', error);
    }
}

function* searchUpdateLastTagsBlock ({ type, blockNr }) {
    try {
        yield apply(searchService, searchService.updateLastTagsBlock, [{ type, blockNr }]);
    } catch (error) {
        console.error('update last tags block error -', error);
    }
}

// Channel watchers

function* watchSearchProfilesChannel () {
    while (true) {
        const resp = yield take(actionChannels.search.findProfiles);
        const { collection } = resp.data;
        const query = yield select(selectSearchQuery);
        const queryAutocomplete = yield select(selectSearchQueryAutocomplete);
        const isValidResp = resp.request.autocomplete ?
            queryAutocomplete === resp.request.text :
            query === resp.request.text;
        if (resp.error) {
            yield put(actions.searchProfilesError(resp.error, resp.request));
        } else if (collection && isValidResp) {
            if (!resp.request.autocomplete) {
                const ethAddresses = collection.map(res => res.ethAddress);
                if (ethAddresses.length) {
                    yield put(profileActions.profileIsFollower(ethAddresses));
                }
                for (let i = 0; i < collection.length; i++) {
                    const { ethAddress } = collection[i];
                    yield put(profileActions.profileGetData({ ethAddress, context: SEARCH }));
                }
                yield put(actions.searchProfilesSuccess(ethAddresses, resp.request));
            } else {
                const akashaIds = collection.map(profile => profile.akashaId);
                yield put(actions.searchProfilesSuccess(akashaIds, resp.request));
            }
        }
    }
}

function* watchSearchQueryChannel () {
    while (true) {
        const resp = yield take(actionChannels.search.query);
        const query = yield select(selectSearchQuery);
        if (resp.error) {
            if (resp.request.offset) {
                yield put(actions.searchMoreQueryError(resp.error, resp.request));
            } else {
                yield put(actions.searchQueryError(resp.error, resp.request));
            }
        } else if (resp.data.collection && resp.request.text === query) {
            const collection = resp.data.collection.map(res => (
                { entryId: res.entryId, author: { ethAddress: res.ethAddress } }
            ));
            if (resp.request.offset) {
                yield put(actions.searchMoreQuerySuccess(resp.data, resp.request));
                yield fork(entryGetExtraOfList, collection, SEARCH);
            } else {
                yield put(actions.searchQuerySuccess(resp.data, resp.request));
                yield fork(entryGetExtraOfList, collection, SEARCH);
            }
        }
    }
}

function* watchSearchSyncEntriesChannel () {
    while (true) {
        const resp = yield take(actionChannels.search.syncEntries);
        if (resp.error) {
            yield put(actions.searchSyncEntriesError(resp.error));
        } else if (resp.data.done) {
            const blockNr = resp.data.lastBlock;
            const ethAddress = yield select(selectLoggedEthAddress);
            yield fork(searchUpdateLastEntriesBlock, { ethAddress, blockNr });
        }
    }
}

function* watchSearchSyncTagsChannel () {
    while (true) {
        const resp = yield take(actionChannels.search.syncTags);
        if (resp.error) {
            yield put(actions.searchSyncTagsError(resp.error));
        } else if (resp.data.done) {
            const blockNr = resp.data.lastBlock;
            yield fork(searchUpdateLastTagsBlock, { type: 'tags', blockNr });
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
            if (!resp.request.autocomplete) {
                yield put(tagActions.tagGetEntriesCount(resp.data.collection));
            }
        }
    }
}

export function* registerSearchListeners () {
    yield fork(watchSearchQueryChannel);
    yield fork(watchSearchProfilesChannel);
    yield fork(watchSearchSyncEntriesChannel);
    yield fork(watchSearchSyncTagsChannel);
    yield fork(watchSearchTagsChannel);
}

export function* watchSearchActions () {
    yield takeLatest(types.SEARCH_MORE_QUERY, searchMoreQuery);
    yield takeLatest(types.SEARCH_QUERY, searchQuery);
    yield takeEvery(types.SEARCH_PROFILES, searchProfiles);
    yield takeLatest(types.SEARCH_SYNC_ENTRIES, searchSyncEntries);
    yield takeLatest(types.SEARCH_SYNC_TAGS, searchSyncTags);
    yield takeEvery(types.SEARCH_TAGS, searchTags);
}

export function* registerWatchers () {
    yield fork(registerSearchListeners);
    yield fork(watchSearchActions);
}
