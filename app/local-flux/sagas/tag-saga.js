// @flow
import { call, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { TAGS_MODULE, ENTRY_MODULE } from '@akashaproject/common/constants';
import { profileSelectors } from '../selectors';
import * as types from '../constants';
import chReqService from '../services/channel-request-service';

/*::
    import type { Saga } from 'redux-saga';
 */

const TAG_SEARCH_LIMIT = 10;

function* tagCreate ({ data }) /* : Saga<void> */ {
    const token = yield select(profileSelectors.getToken());
    yield call([chReqService, chReqService.sendRequest], TAGS_MODULE, TAGS_MODULE.createTag, data);
}

function* tagCanCreateCheck ({ data }) /* : Saga<void> */ {
    const { ethAddress } = data;
    yield call([chReqService, chReqService.sendRequest], TAGS_MODULE, TAGS_MODULE.canCreate, { ethAddress });
}

function* tagExists ({ data }) /* : Saga<void> */ {
    yield call([chReqService, chReqService.sendRequest], TAGS_MODULE, TAGS_MODULE.existsTag, data);
}

function* tagGetEntriesCount ({ tags }) /* : Saga<void> */ {
    yield call([chReqService, chReqService.sendRequest], ENTRY_MODULE, ENTRY_MODULE.getTagEntriesCount, tags);
}

export function* watchTagActions () /* : Saga<void> */ {
    yield takeEvery(TAGS_MODULE.createTag, tagCreate);
    yield takeEvery(TAGS_MODULE.existsTag, tagExists);
    yield takeEvery(ENTRY_MODULE.getTagEntriesCount, tagGetEntriesCount);
    yield takeLatest(TAGS_MODULE.canCreate, tagCanCreateCheck);
}
