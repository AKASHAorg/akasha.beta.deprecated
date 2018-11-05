// @flow
import { call, put, select, takeEvery } from 'redux-saga/effects';
import * as actions from '../actions/list-actions';
import * as dashboardActions from '../actions/dashboard-actions';
import * as types from '../constants';
import { profileSelectors } from '../selectors';
import * as listService from '../services/list-service';

/*::
    import type { Saga } from 'redux-saga'; // eslint-disable-line
 */

function* listAdd ({ name, description, entryIds = [], addColumn })/* : Saga<void> */ {
    try {
        const ethAddress = yield select(profileSelectors.selectLoggedEthAddress);
        const list = { ethAddress, name, description, entryIds };
        const { id, timestamp } = yield call([listService, listService.addList], list);
        yield put(actions.listAddSuccess({ id, timestamp, ...list }));
        if (addColumn) {
            yield put(dashboardActions.dashboardAddColumn('list', id));
        }
    } catch (error) {
        yield put(actions.listAddError(error));
    }
}

function* listDelete ({ id })/* : Saga<void> */ {
    try {
        yield call([listService, listService.deleteList], id);
        yield put(actions.listDeleteSuccess(id));
    } catch (error) {
        yield put(actions.listDeleteError(error));
    }
}

function* listDeleteEntry ({ id, entryId })/* : Saga<void> */ {
    try {
        const ethAddress = yield select(profileSelectors.selectLoggedEthAddress);
        const list = yield call([listService, listService.deleteEntry], { ethAddress, id, entryId });
        yield put(actions.listDeleteEntrySuccess(list));
    } catch (error) {
        yield put(actions.listDeleteEntryError(error));
    }
}

function* listEdit ({ id, name, description })/* : Saga<void> */ {
    try {
        const list = yield call([listService, listService.editList], { id, name, description });
        yield put(actions.listEditSuccess(list));
    } catch (error) {
        yield put(actions.listEditError(error));
    }
}

export function* listGetAll ()/* : Saga<void> */ {
    try {
        const ethAddress = yield select(profileSelectors.selectLoggedEthAddress);
        const lists = yield call([listService, listService.getAllLists], ethAddress);
        yield put(actions.listGetAllSuccess(lists));
    } catch (error) {
        yield put(actions.listGetAllError(error));
    }
}

function* listGetFull ({ id })/* : Saga<void> */ {
    try {
        const ethAddress = yield select(profileSelectors.selectLoggedEthAddress);
        const data = yield call([listService, listService.getList], { ethAddress, id });
        yield put(actions.listGetFullSucess(data));
    } catch (error) {
        yield put(actions.listGetFullError(error));
    }
}

function* listSearch ({ search })/* : Saga<void> */ {
    try {
        const ethAddress = yield select(profileSelectors.selectLoggedEthAddress);
        search = search.toLowerCase();
        const data = yield call([listService, listService.searchList], { ethAddress, search });
        yield put(actions.listSearchSuccess(data));
    } catch (error) {
        yield put(actions.listSearchError(error));
    }
}

function* listToggleEntry ({ id, entryId, entryType, authorEthAddress })/* : Saga<void> */ {
    try {
        const loggedEthAddress = yield select(profileSelectors.selectLoggedEthAddress);
        const list = yield call(
            [listService, listService.toggleEntry],
            { ethAddress: loggedEthAddress, id, entryId, entryType, authorEthAddress }
        );
        const request = { entryId };
        yield put(actions.listToggleEntrySuccess(list, request));
    } catch (error) {
        yield put(actions.listToggleEntryError(error));
    }
}

// Action watchers
export function* watchListActions ()/* : Saga<void> */ {
    yield takeEvery(types.LIST_ADD, listAdd);
    yield takeEvery(types.LIST_DELETE, listDelete);
    yield takeEvery(types.LIST_DELETE_ENTRY, listDeleteEntry);
    yield takeEvery(types.LIST_EDIT, listEdit);
    yield takeEvery(types.LIST_GET_FULL, listGetFull);
    yield takeEvery(types.LIST_SEARCH, listSearch);
    yield takeEvery(types.LIST_TOGGLE_ENTRY, listToggleEntry);
}
