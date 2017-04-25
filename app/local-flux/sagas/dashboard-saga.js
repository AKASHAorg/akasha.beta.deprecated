import { apply, fork, put, select, takeEvery } from 'redux-saga/effects';
import * as actions from '../actions/dashboard-actions';
import * as dashboardService from '../services/dashboard-service';
import * as types from '../constants';
import { selectLoggedAkashaId } from '../selectors';

function* dashboardAdd ({ name }) {
    try {
        const akashaId = yield select(selectLoggedAkashaId);
        const id = yield apply(
            dashboardService,
            dashboardService.addDashboard,
            [{ akashaId, name }]
        );
        const data = { id, akashaId, name };
        yield put(actions.dashboardAddSuccess(data));
    } catch (error) {
        yield put(actions.dashboardAddError(error));
    }
}

function* dashboardAddColumn ({ columnType }) {
    try {
        const dashboardId = yield select(state => state.dashboardState.get('activeDashboard'));
        const id = yield apply(
            dashboardService,
            dashboardService.addColumn,
            [{ dashboardId, type: columnType }]
        );
        const data = { id, dashboardId, type: columnType };
        yield put(actions.dashboardAddColumnSuccess(data));
    } catch (error) {
        yield put(actions.dashboardAddColumnError(error));
    }
}

function* dashboardDelete ({ id }) {
    try {
        yield apply(dashboardService, dashboardService.deleteDashboard, [id]);
        yield put(actions.dashboardDeleteSuccess({ id }));
    } catch (error) {
        yield put(actions.dashboardDeleteError(error));
    }
}

function* dashboardDeleteColumn ({ columnId }) {
    try {
        const dashboardId = yield select(state => state.dashboardState.get('activeDashboard'));
        yield apply(
            dashboardService,
            dashboardService.deleteColumn,
            [{ dashboardId, columnId }]
        );
        yield put(actions.dashboardDeleteColumnSuccess({ dashboardId, columnId }));
    } catch (error) {
        yield put(actions.dashboardDeleteColumnError(error));
    }
}

export function* dashboardGetActive () {
    try {
        const akashaId = yield select(selectLoggedAkashaId);
        const data = yield apply(dashboardService, dashboardService.getActive, [akashaId]);
        yield put(actions.dashboardGetActiveSuccess(data && data.id));
    } catch (error) {
        yield put(actions.dashboardGetActiveError(error));
    }
}

export function* dashboardGetAll () {
    try {
        const akashaId = yield select(selectLoggedAkashaId);
        const data = yield apply(dashboardService, dashboardService.getAll, [akashaId]);
        yield put(actions.dashboardGetAllSuccess(data));
    } catch (error) {
        yield put(actions.dashboardGetAllError(error));
    }
}

export function* dashboardGetColumns () {
    try {
        const data = yield apply(dashboardService, dashboardService.getColumns);
        yield put(actions.dashboardGetColumnsSuccess(data));
    } catch (error) {
        yield put(actions.dashboardGetColumnsError(error));
    }
}

function* dashboardSetActive ({ id }) {
    try {
        const akashaId = yield select(selectLoggedAkashaId);
        yield apply(dashboardService, dashboardService.setActive, [{ akashaId, id }]);
        yield put(actions.dashboardSetActiveSuccess(id));
    } catch (error) {
        yield put(actions.dashboardSetActiveError(error));
    }
}

function* dashboardUpdateColumn ({ id, value }) {
    try {
        yield apply(
            dashboardService,
            dashboardService.updateColumn,
            [{ id, value }]
        );
        const data = { id, value };
        yield put(actions.dashboardUpdateColumnSuccess(data));
    } catch (error) {
        yield put(actions.dashboardUpdateColumnError(error));
    }
}

// Action watchers

function* watchDashboardAdd () {
    yield takeEvery(types.DASHBOARD_ADD, dashboardAdd);
}

function* watchDashboardAddColumn () {
    yield takeEvery(types.DASHBOARD_ADD_COLUMN, dashboardAddColumn);
}

function* watchDashboardDelete () {
    yield takeEvery(types.DASHBOARD_DELETE, dashboardDelete);
}

function* watchDashboardDeleteColumn () {
    yield takeEvery(types.DASHBOARD_DELETE_COLUMN, dashboardDeleteColumn);
}

function* watchDashboardSetActive () {
    yield takeEvery(types.DASHBOARD_SET_ACTIVE, dashboardSetActive);
}

function* watchDashboardUpdateColumn () {
    yield takeEvery(types.DASHBOARD_UPDATE_COLUMN, dashboardUpdateColumn);
}

export function* watchDashboardActions () {
    yield fork(watchDashboardAdd);
    yield fork(watchDashboardAddColumn);
    yield fork(watchDashboardDelete);
    yield fork(watchDashboardDeleteColumn);
    yield fork(watchDashboardSetActive);
    yield fork(watchDashboardUpdateColumn);
}
