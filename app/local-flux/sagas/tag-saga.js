// @flow
import { call, getContext, takeEvery, takeLatest } from 'redux-saga/effects';
import { ENTRY_MODULE, TAGS_MODULE } from '@akashaproject/common/constants';
// import { profileSelectors } from '../selectors';

/*::
    import type { Saga } from 'redux-saga';
 */

// const TAG_SEARCH_LIMIT = 10;

function* tagCreate ({ data }) /* : Saga<void> */ {
    const service = yield getContext('reqService');
    // const token = yield select(profileSelectors.getToken());
    yield call([service, service.sendRequest], TAGS_MODULE, TAGS_MODULE.createTag, data);
}

function* tagCanCreateCheck ({ data }) /* : Saga<void> */ {
    const service = yield getContext('reqService');
    const { ethAddress } = data;
    yield call([service, service.sendRequest], TAGS_MODULE, TAGS_MODULE.canCreate, { ethAddress });
}

function* tagExists ({ data }) /* : Saga<void> */ {
    const service = yield getContext('reqService');
    yield call([service, service.sendRequest], TAGS_MODULE, TAGS_MODULE.existsTag, data);
}

function* tagGetEntriesCount ({ tags }) /* : Saga<void> */ {
    const service = yield getContext('reqService');
    yield call([service, service.sendRequest], ENTRY_MODULE, ENTRY_MODULE.getTagEntriesCount, tags);
}

export function* watchTagActions () /* : Saga<void> */ {
    yield takeEvery(TAGS_MODULE.createTag, tagCreate);
    yield takeEvery(TAGS_MODULE.existsTag, tagExists);
    yield takeEvery(ENTRY_MODULE.getTagEntriesCount, tagGetEntriesCount);
    yield takeLatest(TAGS_MODULE.canCreate, tagCanCreateCheck);
}
