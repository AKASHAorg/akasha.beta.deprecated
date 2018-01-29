import { apply, call, fork, put, select, takeEvery } from 'redux-saga/effects';
import * as actions from '../actions/dashboard-actions';
import * as dashboardService from '../services/dashboard-service';
import * as types from '../constants';
import * as columnTypes from '../../constants/columns';
import { selectActiveDashboardId, selectDashboards,
    selectLoggedEthAddress } from '../selectors';

function* reorderDashboards () {
    const ethAddress = yield select(selectLoggedEthAddress);
    const ordering = yield select(state => state.dashboardState.get('allDashboards'));
    yield apply(dashboardService, dashboardService.setDashboardOrder, [{ ethAddress, order: ordering.toJS() }]);
}

function* dashboardAdd ({ name, columns = [] }) {
    try {
        const ethAddress = yield select(selectLoggedEthAddress);
        const dashboard = yield apply(
            dashboardService,
            dashboardService.addDashboard,
            [{ ethAddress, columns, name }]
        );
        yield put(actions.dashboardAddSuccess(dashboard));
        yield reorderDashboards();
    } catch (error) {
        yield put(actions.dashboardAddError(error));
    }
}

function* dashboardAddColumn ({ columnType, value }) {
    try {
        const dashboardId = yield select(selectActiveDashboardId);
        const data = yield apply(
            dashboardService,
            dashboardService.addColumn,
            [{ dashboardId, type: columnType, value }]
        );
        yield put(actions.dashboardAddColumnSuccess(data));
    } catch (error) {
        yield put(actions.dashboardAddColumnError(error));
    }
}

function* dashboardAddFirst ({ name, interests }) {
    const columns = interests ?
        interests.tag.map(tag => ({ type: columnTypes.tag, value: tag })) :
        [];
    columns.unshift({ type: columnTypes.latest });
    yield call(dashboardAdd, { name, columns });
    yield put(actions.dashboardAddFirstSuccess());
}

function* dashboardDelete ({ id }) {
    try {
        yield apply(dashboardService, dashboardService.deleteDashboard, [id]);
        yield fork(dashboardSetNextActive, id); // eslint-disable-line
        yield put(actions.dashboardDeleteSuccess({ id }));
        yield reorderDashboards();
    } catch (error) {
        yield put(actions.dashboardDeleteError(error));
    }
}

function* dashboardDeleteColumn ({ columnId }) {
    try {
        const dashboardId = yield select(selectActiveDashboardId);
        const dashboard = yield apply(
            dashboardService,
            dashboardService.deleteColumn,
            [{ dashboardId, columnId }]
        );
        yield put(actions.dashboardDeleteColumnSuccess({ columnId, dashboard }));
    } catch (error) {
        yield put(actions.dashboardDeleteColumnError(error));
    }
}

export function* dashboardGetActive () {
    try {
        const ethAddress = yield select(selectLoggedEthAddress);
        const data = yield apply(dashboardService, dashboardService.getActive, [ethAddress]);
        yield put(actions.dashboardGetActiveSuccess(data && data.id));
    } catch (error) {
        yield put(actions.dashboardGetActiveError(error));
    }
}

export function* dashboardGetAll () {
    try {
        const ethAddress = yield select(selectLoggedEthAddress);
        let data = yield apply(dashboardService, dashboardService.getAll, [ethAddress]);
        const orderedData = yield apply(dashboardService, dashboardService.getDashboardOrder, [ethAddress]);
        if (orderedData.length) {
            data = orderedData.map(dashId => data.find(el => el.id === dashId));
        }
        yield put(actions.dashboardGetAllSuccess(data));
    } catch (error) {
        yield put(actions.dashboardGetAllError(error));
    }
}

function* dashboardRename ({ dashboardId, newName }) {
    try {
        const ethAddress = yield select(selectLoggedEthAddress);
        const data = yield apply(
            dashboardService,
            dashboardService.renameDashboard,
            [{ dashboardId, ethAddress, newName }]
        );
        yield put(actions.dashboardRenameSuccess(data));
    } catch (error) {
        yield put(actions.dashboardRenameError(error));
    }
}

function* dashboardSetActive ({ id }) {
    try {
        const ethAddress = yield select(selectLoggedEthAddress);
        yield apply(dashboardService, dashboardService.setActive, [{ ethAddress, id }]);
        yield put(actions.dashboardSetActiveSuccess(id));
    } catch (error) {
        yield put(actions.dashboardSetActiveError(error));
    }
}

function* dashboardSetNextActive (id) {
    const activeDashboard = yield select(state => state.dashboardState.get('activeDashboard'));
    if (activeDashboard === id) {
        const dashboards = (yield select(selectDashboards)).toList();
        const index = dashboards.findIndex(dashboard => dashboard.get('id') === id);
        let newActiveDashboard;
        if (index === dashboards.size - 1) {
            newActiveDashboard = dashboards.getIn([index - 1, 'id']);
        } else {
            newActiveDashboard = dashboards.getIn([index + 1, 'id']);
        }
        yield put(actions.dashboardSetActive(newActiveDashboard));
    }
}

function* dashboardToggleProfileColumn ({ dashboardId, ethAddress }) {
    try {
        const dashboard = yield apply(
            dashboardService,
            dashboardService.toggleColumn,
            [{ dashboardId, columnType: columnTypes.profile, value: ethAddress }]
        );
        yield put(actions.dashboardToggleProfileColumnSuccess(dashboard));
    } catch (error) {
        yield put(actions.dashboardToggleProfileColumnError(error));
    }
}

function* dashboardToggleTagColumn ({ dashboardId, tag }) {
    try {
        const dashboard = yield apply(
            dashboardService,
            dashboardService.toggleColumn,
            [{ dashboardId, columnType: columnTypes.tag, value: tag }]
        );
        yield put(actions.dashboardToggleTagColumnSuccess(dashboard));
    } catch (error) {
        yield put(actions.dashboardToggleTagColumnError(error));
    }
}

function* dashboardUpdateColumn ({ id, changes }) {
    try {
        const dashboardId = yield select(selectActiveDashboardId);
        yield apply(
            dashboardService,
            dashboardService.updateColumn,
            [{ dashboardId, id, changes }]
        );
        const data = { id, changes };
        yield put(actions.dashboardUpdateColumnSuccess(data));
    } catch (error) {
        yield put(actions.dashboardUpdateColumnError(error));
    }
}

function* reorderColumns ({ data }) {
    const columns = yield select(state => state.dashboardState.getIn(['byId', data.dashboardId, 'columns']));
    yield apply(dashboardService, dashboardService.setColumns, [{ dashboardId: data.dashboardId, columns: columns.toJS() }]);
}

export function* watchDashboardActions () {
    yield takeEvery(types.DASHBOARD_ADD, dashboardAdd);
    yield takeEvery(types.DASHBOARD_ADD_COLUMN, dashboardAddColumn);
    yield takeEvery(types.DASHBOARD_ADD_FIRST, dashboardAddFirst);
    yield takeEvery(types.DASHBOARD_DELETE, dashboardDelete);
    yield takeEvery(types.DASHBOARD_DELETE_COLUMN, dashboardDeleteColumn);
    yield takeEvery(types.DASHBOARD_RENAME, dashboardRename);
    yield takeEvery(types.DASHBOARD_SET_ACTIVE, dashboardSetActive);
    yield takeEvery(types.DASHBOARD_TOGGLE_PROFILE_COLUMN, dashboardToggleProfileColumn);
    yield takeEvery(types.DASHBOARD_TOGGLE_TAG_COLUMN, dashboardToggleTagColumn);
    yield takeEvery(types.DASHBOARD_UPDATE_COLUMN, dashboardUpdateColumn);
    yield takeEvery(types.DASHBOARD_REORDER_COLUMN, reorderColumns);
    yield takeEvery(types.DASHBOARD_REORDER, reorderDashboards);
}
