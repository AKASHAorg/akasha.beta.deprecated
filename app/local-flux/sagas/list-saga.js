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

function* listDelete ({ id }) {
    try {
        yield apply(listService, listService.deleteList, [id]);
        yield put(actions.listDeleteSuccess(id));
    } catch (error) {
        yield put(actions.listDeleteError(error));
    }
}

function* listDeleteEntry ({ id, entryId }) {
    try {
        const ethAddress = yield select(selectLoggedEthAddress);
        const list = yield apply(listService, listService.deleteEntry, [{ ethAddress, id, entryId }]);
        yield put(actions.listDeleteEntrySuccess(list));
    } catch (error) {
        yield put(actions.listDeleteEntryError(error));
    }
}

function* listEdit ({ id, name, description }) {
    try {
        const list = yield apply(listService, listService.editList, [{ id, name, description }]);
        yield put(actions.listEditSuccess(list));
    } catch (error) {
        yield put(actions.listEditError(error));
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

function* listGetFull ({ id }) {
    try {
        const ethAddress = yield select(selectLoggedEthAddress);
        const data = yield apply(listService, listService.getList, [{ ethAddress, id }]);
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

function* listToggleEntry ({ id, entryId, entryType, authorEthAddress }) {
    try {
        const loggedEthAddress = yield select(selectLoggedEthAddress);
        const list = yield apply(
            listService,
            listService.toggleEntry,
            [{ ethAddress: loggedEthAddress, id, entryId, entryType, authorEthAddress }]
        );
        const request = { entryId };
        yield put(actions.listToggleEntrySuccess(list, request));
    } catch (error) {
        yield put(actions.listToggleEntryError(error));
    }
}

// Action watchers
export function* watchListActions () {
    yield takeEvery(types.LIST_ADD, listAdd);
    yield takeEvery(types.LIST_DELETE, listDelete);
    yield takeEvery(types.LIST_DELETE_ENTRY, listDeleteEntry);
    yield takeEvery(types.LIST_EDIT, listEdit);
    yield takeEvery(types.LIST_GET_FULL, listGetFull);
    yield takeEvery(types.LIST_SEARCH, listSearch);
    yield takeEvery(types.LIST_TOGGLE_ENTRY, listToggleEntry);
}
