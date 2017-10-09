import { delay } from 'redux-saga';
import { apply, call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import * as actions from '../actions/dashboard-actions';
import * as tagActions from '../actions/tag-actions';
import * as dashboardService from '../services/dashboard-service';
import * as profileService from '../services/profile-service';
import * as tagService from '../services/tag-service';
import * as types from '../constants';
import * as columnTypes from '../../constants/columns';
import { selectActiveDashboardId, selectDashboardId,
    selectLoggedEthAddress } from '../selectors';

function* dashboardAdd ({ name, columns = [] }) {
    try {
        const ethAddress = yield select(selectLoggedEthAddress);
        const dashboard = yield apply(
            dashboardService,
            dashboardService.addDashboard,
            [{ ethAddress, columns, name }]
        );
        yield put(actions.dashboardAddSuccess(dashboard));
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

function* dashboardAddFirst ({ interests }) {
    const columns = interests ?
        interests.tag.map(tag => ({ type: columnTypes.tag, value: tag })) :
        [];
    yield call(dashboardAdd, { name: 'first', columns });
    yield put(actions.dashboardAddFirstSuccess());
}

function* dashboardDelete ({ name }) {
    try {
        const id = yield select(state => selectDashboardId(state, name));
        yield apply(dashboardService, dashboardService.deleteDashboard, [id]);
        yield put(actions.dashboardDeleteSuccess({ name }));
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
        yield put(actions.dashboardGetActiveSuccess(data && data.name));
    } catch (error) {
        yield put(actions.dashboardGetActiveError(error));
    }
}

export function* dashboardGetAll () {
    try {
        const ethAddress = yield select(selectLoggedEthAddress);
        const data = yield apply(dashboardService, dashboardService.getAll, [ethAddress]);
        yield put(actions.dashboardGetAllSuccess(data));
    } catch (error) {
        yield put(actions.dashboardGetAllError(error));
    }
}

export function* dashboardGetProfileSuggestions (request) {
    try {
        const { akashaId } = request;
        const suggestions = yield apply(profileService, profileService.profileGetSuggestions, [akashaId]);
        yield put(actions.dashboardGetProfileSuggestionsSuccess(suggestions, request));
        return { suggestions };
    } catch (error) {
        yield put(actions.dashboardGetProfileSuggestionsError(error, request));
        return { error };
    }
}

function* dashboardGetTagSuggestions (request) {
    const { tag } = request;
    const START = 0;
    const LIMIT = 5;
    try {
        const tags = yield apply(tagService, tagService.tagSearch, [tag, START, LIMIT]);
        const suggestions = tags.tags;
        yield put(actions.dashboardGetTagSuggestionsSuccess(suggestions, request));
        return { suggestions };
    } catch (error) {
        yield put(actions.dashboardGetTagSuggestionsError(error, request));
        return { error };
    }
}

function* dashboardSetActive ({ name }) {
    try {
        const ethAddress = yield select(selectLoggedEthAddress);
        yield apply(dashboardService, dashboardService.setActive, [{ ethAddress, name }]);
        yield put(actions.dashboardSetActiveSuccess(name));
    } catch (error) {
        yield put(actions.dashboardSetActiveError(error));
    }
}

function* dashboardToggleTagColumn ({ dashboardId, tag }) {
    try {
        const dashboard = yield apply(
            dashboardService,
            dashboardService.toggleTagColumn,
            [{ dashboardId, tag }]
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

function* dashboardUpdateNewColumn ({ changes }) {
    if (changes && changes.value) {
        const { suggestions } =
            yield call(dashboardGetTagSuggestions, { tag: changes.value, context: 'column' });
        if (suggestions) {
            const request = suggestions.map(tagName => ({ tagName }));
            yield call(delay, 200);
            yield put(tagActions.tagGetEntriesCount(request));
        }
    }
}

export function* watchDashboardActions () {
    yield takeEvery(types.DASHBOARD_ADD, dashboardAdd);
    yield takeEvery(types.DASHBOARD_ADD_COLUMN, dashboardAddColumn);
    yield takeEvery(types.DASHBOARD_ADD_FIRST, dashboardAddFirst);
    yield takeEvery(types.DASHBOARD_DELETE, dashboardDelete);
    yield takeEvery(types.DASHBOARD_DELETE_COLUMN, dashboardDeleteColumn);
    yield takeLatest(types.DASHBOARD_GET_PROFILE_SUGGESTIONS, dashboardGetProfileSuggestions);
    yield takeLatest(types.DASHBOARD_GET_TAG_SUGGESTIONS, dashboardGetTagSuggestions);
    yield takeEvery(types.DASHBOARD_SET_ACTIVE, dashboardSetActive);
    yield takeEvery(types.DASHBOARD_TOGGLE_TAG_COLUMN, dashboardToggleTagColumn);
    yield takeEvery(types.DASHBOARD_UPDATE_COLUMN, dashboardUpdateColumn);
    yield takeLatest(types.DASHBOARD_UPDATE_NEW_COLUMN, dashboardUpdateNewColumn);
}
