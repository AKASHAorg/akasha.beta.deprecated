import { apply, put, select, takeEvery } from 'redux-saga/effects';
import * as actions from '../actions/list-actions';
import * as types from '../constants';
import { selectLoggedEthAddress } from '../selectors';
import * as listService from '../services/list-service';

function* listAdd ({ name, description, entryIds = [] }) {
    try {
        const ethAddress = yield select(selectLoggedEthAddress);
        const list = { ethAddress, name, description, entryIds };
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
        const ethAddress = yield select(selectLoggedEthAddress);
        const list = yield apply(listService, listService.deleteEntry, [{ ethAddress, name, entryId }]);
        yield put(actions.listDeleteEntrySuccess(list));
    } catch (error) {
        yield put(actions.listDeleteEntryError(error));
    }
}

export function* listGetAll () {
    try {
        const ethAddress = yield select(selectLoggedEthAddress);
        const lists = yield apply(listService, listService.getAllLists, [ethAddress]);
        yield put(actions.listGetAllSuccess(lists));
    } catch (error) {
        yield put(actions.listGetAllError(error));
    }
}

function* listGetFull ({ name }) {
    try {
        const ethAddress = yield select(selectLoggedEthAddress);
        const data = yield apply(listService, listService.getList, [{ ethAddress, name }]);
        yield put(actions.listGetFullSucess(data));
    } catch (error) {
        yield put(actions.listGetFullError(error));
    }
}

function* listSearch ({ search }) {
    try {
        const ethAddress = yield select(selectLoggedEthAddress);
        search = search.toLowerCase();
        const data = yield apply(listService, listService.searchList, [{ ethAddress, search }]);
        yield put(actions.listSearchSuccess(data));
    } catch (error) {
        yield put(actions.listSearchError(error));
    }
}

function* listToggleEntry ({ listName, entryId, authorEthAddress }) {
    try {
        const loggedEthAddress = yield select(selectLoggedEthAddress);
        const list = yield apply(
            listService,
            listService.toggleEntry,
            [{ ethAddress: loggedEthAddress, listName, entryId, authorEthAddress }]
        );
        yield put(actions.listToggleEntrySuccess(list));
    } catch (error) {
        yield put(actions.listToggleEntryError(error));
    }
}

// Action watchers
export function* watchListActions () {
    yield takeEvery(types.LIST_ADD, listAdd);
    yield takeEvery(types.LIST_DELETE, listDelete);
    yield takeEvery(types.LIST_DELETE_ENTRY, listDeleteEntry);
    yield takeEvery(types.LIST_GET_FULL, listGetFull);
    yield takeEvery(types.LIST_SEARCH, listSearch);
    yield takeEvery(types.LIST_TOGGLE_ENTRY, listToggleEntry);
}
