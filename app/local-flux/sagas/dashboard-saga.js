import { delay } from 'redux-saga';
import { all, apply, call, fork, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import * as actions from '../actions/dashboard-actions';
import * as tagActions from '../actions/tag-actions';
import * as dashboardService from '../services/dashboard-service';
import * as profileService from '../services/profile-service';
import * as tagService from '../services/tag-service';
import * as types from '../constants';
import * as columnTypes from '../../constants/columns';
import { selectActiveDashboardId, selectDashboardId,
    selectLoggedAccount } from '../selectors';

function* dashboardAdd ({ name }) {
    try {
        const account = yield select(selectLoggedAccount);
        const id = yield apply(
            dashboardService,
            dashboardService.addDashboard,
            [{ account, name }]
        );
        const data = { id, account, name };
        yield put(actions.dashboardAddSuccess(data));
    } catch (error) {
        yield put(actions.dashboardAddError(error));
    }
}

function* dashboardAddColumn ({ columnType, value }) {
    try {
        const dashboardId = yield select(selectActiveDashboardId);
        const dashboardName = yield select(state => state.dashboardState.get('activeDashboard'));
        const id = yield apply(
            dashboardService,
            dashboardService.addColumn,
            [{ dashboardId, type: columnType, value }]
        );
        const data = { id, dashboardName, type: columnType, value };
        yield put(actions.dashboardAddColumnSuccess(data));
    } catch (error) {
        yield put(actions.dashboardAddColumnError(error));
    }
}

function* dashboardAddFirst ({ interests }) {
    yield call(dashboardAdd, { name: 'first' });
    if (interests) {
        const interestsMap = interests.toJS();
        const addTagColumns = interestsMap[columnTypes.tag].map(interest =>
            put(actions.dashboardAddColumn(columnTypes.tag, interest))
        );
        const addPeopleColumns = interestsMap[columnTypes.profile].map(interest =>
            put(actions.dashboardAddColumn(columnTypes.profile, interest))
        );
        const addColumns = addTagColumns.concat(addPeopleColumns);
        yield all(addColumns);
    }
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
        const dashboardName = yield select(state => state.dashboardState.get('activeDashboard'));
        yield apply(
            dashboardService,
            dashboardService.deleteColumn,
            [{ dashboardId, columnId }]
        );
        yield put(actions.dashboardDeleteColumnSuccess({ dashboardName, columnId }));
    } catch (error) {
        yield put(actions.dashboardDeleteColumnError(error));
    }
}

export function* dashboardGetActive () {
    try {
        const account = yield select(selectLoggedAccount);
        const data = yield apply(dashboardService, dashboardService.getActive, [account]);
        yield put(actions.dashboardGetActiveSuccess(data && data.name));
    } catch (error) {
        yield put(actions.dashboardGetActiveError(error));
    }
}

export function* dashboardGetAll () {
    try {
        const account = yield select(selectLoggedAccount);
        const data = yield apply(dashboardService, dashboardService.getAll, [account]);
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
        const account = yield select(selectLoggedAccount);
        yield apply(dashboardService, dashboardService.setActive, [{ account, name }]);
        yield put(actions.dashboardSetActiveSuccess(name));
    } catch (error) {
        yield put(actions.dashboardSetActiveError(error));
    }
}

function* dashboardUpdateColumn ({ id, changes }) {
    try {
        yield apply(
            dashboardService,
            dashboardService.updateColumn,
            [{ id, changes }]
        );
        const data = { id, changes };
        yield put(actions.dashboardUpdateColumnSuccess(data));
    } catch (error) {
        yield put(actions.dashboardUpdateColumnError(error));
    }
}

function* dashboardUpdateNewColumn ({ changes }) {
    if (changes && changes.value) {
        const { suggestions } = yield call(dashboardGetTagSuggestions, { tag: changes.value, context: 'column' });
        if (suggestions) {
            const request = suggestions.map(tagName => ({ tagName }));
            yield call(delay, 200);
            yield put(tagActions.tagGetEntriesCount(request));
        }
    }
}

// Action watchers

function* watchDashboardAdd () {
    yield takeEvery(types.DASHBOARD_ADD, dashboardAdd);
}

function* watchDashboardAddColumn () {
    yield takeEvery(types.DASHBOARD_ADD_COLUMN, dashboardAddColumn);
}

function* watchDashboardAddFirst () {
    yield takeEvery(types.DASHBOARD_ADD_FIRST, dashboardAddFirst);
}

function* watchDashboardDelete () {
    yield takeEvery(types.DASHBOARD_DELETE, dashboardDelete);
}

function* watchDashboardDeleteColumn () {
    yield takeEvery(types.DASHBOARD_DELETE_COLUMN, dashboardDeleteColumn);
}

function* watchDashboardGetProfileSuggestions () {
    yield takeLatest(types.DASHBOARD_GET_PROFILE_SUGGESTIONS, dashboardGetProfileSuggestions);
}

function* watchDashboardGetTagSuggestions () {
    yield takeLatest(types.DASHBOARD_GET_TAG_SUGGESTIONS, dashboardGetTagSuggestions);
}

function* watchDashboardSetActive () {
    yield takeEvery(types.DASHBOARD_SET_ACTIVE, dashboardSetActive);
}

function* watchDashboardUpdateColumn () {
    yield takeEvery(types.DASHBOARD_UPDATE_COLUMN, dashboardUpdateColumn);
}

function* watchDashboardUpdateNewColumn () {
    yield takeLatest(types.DASHBOARD_UPDATE_NEW_COLUMN, dashboardUpdateNewColumn);
}

export function* watchDashboardActions () {
    yield fork(watchDashboardAdd);
    yield fork(watchDashboardAddColumn);
    yield fork(watchDashboardAddFirst);
    yield fork(watchDashboardDelete);
    yield fork(watchDashboardDeleteColumn);
    yield fork(watchDashboardGetProfileSuggestions);
    yield fork(watchDashboardGetTagSuggestions);
    yield fork(watchDashboardSetActive);
    yield fork(watchDashboardUpdateColumn);
    yield fork(watchDashboardUpdateNewColumn);
}
