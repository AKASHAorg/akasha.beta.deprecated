import { apply, put, select, takeEvery } from 'redux-saga/effects';
import * as actions from '../actions/list-actions';
import * as types from '../constants';
import { selectLoggedAccount } from '../selectors';
import * as listService from '../services/list-service';

function* listAdd ({ name, description, entryIds = [] }) {
    try {
        const account = yield select(selectLoggedAccount);
        const list = { account, name, description, entryIds };
        const { id, timestamp } = yield apply(listService, listService.addList, [list]);
        yield put(actions.listAddSuccess({ id, timestamp, ...list }));
    } catch (error) {
        yield put(actions.listAddError(error));
    }
}

function* listDelete ({ listId, name }) {
    try {
        yield apply(listService, listService.deleteList, [listId]);
        yield put(actions.listDeleteSuccess(name));
    } catch (error) {
        yield put(actions.listDeleteError(error));
    }
}

function* listDeleteEntry ({ name, entryId }) {
    try {
        const account = yield select(selectLoggedAccount);
        const list = yield apply(listService, listService.deleteEntry, [{ account, name, entryId }]);
        yield put(actions.listDeleteEntrySuccess(list));
    } catch (error) {
        yield put(actions.listDeleteEntryError(error));
    }
}

export function* listGetAll () {
    try {
        const account = yield select(selectLoggedAccount);
        const lists = yield apply(listService, listService.getAllLists, [account]);
        yield put(actions.listGetAllSuccess(lists));
    } catch (error) {
        yield put(actions.listGetAllError(error));
    }
}

function* listGetFull ({ name }) {
    try {
        const account = yield select(selectLoggedAccount);
        const data = yield apply(listService, listService.getList, [{ account, name }]);
        yield put(actions.listGetFullSucess(data));
    } catch (error) {
        yield put(actions.listGetFullError(error));
    }
}

function* listSearch ({ search }) {
    try {
        const account = yield select(selectLoggedAccount);
        search = search.toLowerCase();
        const data = yield apply(listService, listService.searchList, [{ account, search }]);
        yield put(actions.listSearchSuccess(data));
    } catch (error) {
        yield put(actions.listSearchError(error));
    }
}

function* listUpdateEntryIds ({ listNames, entryId }) {
    try {
        const account = yield select(selectLoggedAccount);
        const lists = yield apply(
            listService,
            listService.updateEntryIds,
            [{ account, listNames, entryId }]
        );
        yield put(actions.listUpdateEntryIdsSuccess(lists));
    } catch (error) {
        yield put(actions.listUpdateEntryIdsError(error));
    }
}

// Action watchers
export function* watchListActions () {
    yield takeEvery(types.LIST_ADD, listAdd);
    yield takeEvery(types.LIST_DELETE, listDelete);
    yield takeEvery(types.LIST_DELETE_ENTRY, listDeleteEntry);
    yield takeEvery(types.LIST_GET_FULL, listGetFull);
    yield takeEvery(types.LIST_SEARCH, listSearch);
    yield takeEvery(types.LIST_UPDATE_ENTRY_IDS, listUpdateEntryIds);
}
