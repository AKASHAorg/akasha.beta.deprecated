// @flow
import { call, put, select, takeEvery } from 'redux-saga/effects';
import { Map } from 'immutable';
import * as actions from '../actions/highlight-actions';
import * as appActions from '../actions/app-actions';
import * as types from '../constants';
import * as highlightService from '../services/highlight-service';
import { profileSelectors } from '../selectors';

/*::
    import type { Saga } from 'redux-saga'; // eslint-disable-line
*/

function* highlightDelete ({ id })/* : Saga<void> */ {
    try {
        yield call([highlightService, highlightService.deleteHighlight], id);
        yield put(actions.highlightDeleteSuccess(id));
    } catch (error) {
        yield put(actions.highlightDeleteError(error));
    }
}

function* highlightEditNotes ({ type, ...payload })/* : Saga<void> */ {
    try {
        const highlight = yield call([highlightService, highlightService.editNotes], payload);
        yield put(actions.highlightEditNotesSuccess(highlight));
    } catch (error) {
        yield put(actions.highlightEditNotesError(error));
    }
}

export function* highlightGetAll ()/* : Saga<void> */ {
    try {
        const ethAddress = yield select(profileSelectors.selectLoggedEthAddress);
        const data = yield call([highlightService, highlightService.getAll], ethAddress);
        yield put(actions.highlightGetAllSuccess(data));
    } catch (error) {
        yield put(actions.highlightGetAllError(error));
    }
}

function* highlightSave ({ payload })/* : Saga<void> */ {
    try {
        const ethAddress = yield select(profileSelectors.selectLoggedEthAddress);
        const highlight = yield call(
            [highlightService, highlightService.saveHighlight],
            { ethAddress, ...payload }
        );
        yield put(actions.highlightSaveSuccess(highlight));
        yield put(appActions.showNotification({
            id: 'highlightSaveSuccess',
            type: types.HIGHLIGHT_SAVE_SUCCESS,
            values: Map({ id: highlight.id })
        }));
    } catch (error) {
        yield put(actions.highlightSaveError(error));
    }
}

function* highlightSearch ({ search })/* : Saga<void> */ {
    try {
        const ethAddress = yield select(profileSelectors.selectLoggedEthAddress);
        search = search.toLowerCase();
        const data = yield call(
            [highlightService, highlightService.searchHighlight],
            { ethAddress, search }
        );
        yield put(actions.highlightSearchSuccess(data));
    } catch (error) {
        yield put(actions.highlightSearchError(error));
    }
}

export function* watchHighlightActions ()/* : Saga<void> */ {
    yield takeEvery(types.HIGHLIGHT_DELETE, highlightDelete);
    yield takeEvery(types.HIGHLIGHT_EDIT_NOTES, highlightEditNotes);
    yield takeEvery(types.HIGHLIGHT_SAVE, highlightSave);
    yield takeEvery(types.HIGHLIGHT_SEARCH, highlightSearch);
}
