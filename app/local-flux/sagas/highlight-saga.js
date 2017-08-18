import { apply, put, select, takeEvery } from 'redux-saga/effects';
import * as actions from '../actions/highlight-actions';
import * as types from '../constants';
import * as highlightService from '../services/highlight-service';
import { selectLoggedAccount } from '../selectors';

function* highlightSave ({ payload }) {
    try {
        const account = yield select(selectLoggedAccount);
        const highlight = yield apply(
            highlightService,
            highlightService.saveHighlight,
            [{ account, ...payload }]
        );
        yield put(actions.highlightSaveSuccess(highlight));
    } catch (error) {
        yield put(actions.highlightSaveError(error));
    }
}

export function* watchHighlightActions () {
    yield takeEvery(types.HIGHLIGHT_SAVE, highlightSave);
}
