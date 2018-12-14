//@flow
import { call, select, takeEvery, takeLatest } from 'redux-saga/effects';
import * as types from '../constants';
import { entrySearchLimit, autocompleteLimit,
    profileSearchLimit, tagSearchLimit } from '../../constants/iterator-limits';
import { searchSelectors, profileSelectors } from '../selectors';
import * as searchService from '../services/search-service';
import { SEARCH_MODULE, TAGS_MODULE, ENTRY_MODULE } from '@akashaproject/common/constants';
import ChReqService from '../services/channel-request-service';

import { deprecatedTypeWarning } from './helpers';
/*::
    import type { Saga } from 'redux-saga';
 */

function* searchMoreQuery ()/* : Saga<void> */ {
    const text = yield select(searchSelectors.selectSearchQuery);
    const offset = yield select(searchSelectors.selectSearchEntryOffset);
    yield call(
        [ChReqService, ChReqService.sendRequest],
        SEARCH_MODULE, SEARCH_MODULE.query,
        { text, pageSize: entrySearchLimit, offset }
    );
}

function* searchQuery ({ text })/* : Saga<void> */ {
    if (text.length) {
        yield call(
            [ChReqService, ChReqService.sendRequest],
            SEARCH_MODULE, SEARCH_MODULE.query,
            { text, pageSize: entrySearchLimit }
        )
    }
}

function* searchProfiles ({ query, autocomplete })/* : Saga<void> */ {
    const limit = autocomplete ? autocompleteLimit : profileSearchLimit;
    if (query.length) {
        yield call(
            [ChReqService, ChReqService.sendRequest],
            SEARCH_MODULE, SEARCH_MODULE.findProfiles,
            { text: query.toLowerCase(), limit, autocomplete }
        );
    }
}

function* searchSyncEntries ({ following })/* : Saga<void> */ {
    const ethAddress = yield select(profileSelectors.selectLoggedEthAddress);
    if (ethAddress) {
        let fromBlock;
        try {
            fromBlock = yield call(
                [searchService, searchService.getLastEntriesBlock],
                ethAddress
            );
        } catch (error) {
            // @todo do proper error handling
            // console.error('get last entries block error -', error);
            // console.error('for ethAddress', ethAddress);
        }
        yield call(
            [ChReqService, ChReqService.sendRequest],
            SEARCH_MODULE, SEARCH_MODULE.syncEntries,
            { fromBlock, following }
        )
    }
}

function* searchSyncTags ()/* : Saga<void> */ {
    let fromBlock;
    try {
        fromBlock = yield call([searchService, searchService.getLastTagsBlock], 'tags');
    } catch (error) {
        // @todo do proper error handling
        // console.error('get last tags block error -', error);
    }
    fromBlock = fromBlock || 0;
    yield call(
        [ChReqService, ChReqService.sendRequest],
        TAGS_MODULE, TAGS_MODULE.syncTags,
        { fromBlock }
    )
}

function* searchTags ({ query, autocomplete })/* : Saga<void> */ {
    const limit = autocomplete ? autocompleteLimit : tagSearchLimit;
    if (query.length) {
        yield call(
            [ChReqService, ChReqService.sendRequest],
            SEARCH_MODULE, SEARCH_MODULE.findTags,
            { text: query.toLowerCase(), limit, autocomplete }
        );
    }
}

function* searchUpdateLastEntriesBlock ({ ethAddress, blockNr })/* : Saga<void> */ {
    try {
        yield call(
            [searchService, searchService.updateLastEntriesBlock],
            { ethAddress, blockNr }
        );
    } catch (error) {
        // @todo do proper error handling
        // console.error('update last entries block error -', error);
    }
}

function* searchUpdateLastTagsBlock ({ type, blockNr })/* : Saga<void> */ {
    try {
        yield call(
            [searchService, searchService.updateLastTagsBlock],
            { type, blockNr }
        );
    } catch (error) {
        // @todo do proper error handling
        // console.error('update last tags block error -', error);
    }
}

export function* watchSearchActions ()/* : Saga<void> */ {
    yield takeLatest(types.SEARCH_MORE_QUERY, deprecatedTypeWarning('SEARCH_MODULE.query'))
    yield takeLatest(SEARCH_MODULE.query, searchQuery);
    yield takeEvery(SEARCH_MODULE.findProfiles, searchProfiles);
    yield takeLatest(ENTRY_MODULE.syncEntries, searchSyncEntries);
    yield takeLatest(TAGS_MODULE.syncTags, searchSyncTags);
    yield takeEvery(TAGS_MODULE.searchTag, searchTags);
}

