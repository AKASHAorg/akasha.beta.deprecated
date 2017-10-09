import { apply, put, select, takeEvery } from 'redux-saga/effects';
import { Map } from 'immutable';
import * as actions from '../actions/highlight-actions';
import * as appActions from '../actions/app-actions';
import * as types from '../constants';
import * as highlightService from '../services/highlight-service';
import { selectLoggedEthAddress } from '../selectors';

function* highlightDelete ({ id }) {
    try {
        yield apply(highlightService, highlightService.deleteHighlight, [id]);
        yield put(actions.highlightDeleteSuccess(id));
    } catch (error) {
        yield put(actions.highlightDeleteError(error));
    }
}

function* highlightEditNotes ({ type, ...payload }) {
    try {
        const highlight = yield apply(highlightService, highlightService.editNotes, [payload]);
        yield put(actions.highlightEditNotesSuccess(highlight));
    } catch (error) {
        yield put(actions.highlightEditNotesError(error));
    }
}

export function* highlightGetAll () {
    try {
        const ethAddress = yield select(selectLoggedEthAddress);
        const data = yield apply(highlightService, highlightService.getAll, [ethAddress]);
        yield put(actions.highlightGetAllSuccess(data));
    } catch (error) {
        yield put(actions.highlightGetAllError(error));
    }
}

function* highlightSave ({ payload }) {
    try {
        const ethAddress = yield select(selectLoggedEthAddress);
        const highlight = yield apply(
            highlightService,
            highlightService.saveHighlight,
            [{ ethAddress, ...payload }]
        );
        yield put(actions.highlightSaveSuccess(highlight));
        yield put(appActions.showNotification({
            id: 'highlightSaveSuccess',
            type: types.HIGHLIGHT_SAVE_SUCCESS,
            values: new Map({ id: highlight.id })
        }));
    } catch (error) {
        yield put(actions.highlightSaveError(error));
    }
}

function* highlightSearch ({ search }) {
    try {
        const ethAddress = yield select(selectLoggedEthAddress);
        search = search.toLowerCase();
        const data = yield apply(
            highlightService,
            highlightService.searchHighlight,
            [{ ethAddress, search }]
        );
        yield put(actions.highlightSearchSuccess(data));
    } catch (error) {
        yield put(actions.highlightSearchError(error));
    }
}

export function* watchHighlightActions () {
    yield takeEvery(types.HIGHLIGHT_DELETE, highlightDelete);
    yield takeEvery(types.HIGHLIGHT_EDIT_NOTES, highlightEditNotes);
    yield takeEvery(types.HIGHLIGHT_SAVE, highlightSave);
    yield takeEvery(types.HIGHLIGHT_SEARCH, highlightSearch);
}
