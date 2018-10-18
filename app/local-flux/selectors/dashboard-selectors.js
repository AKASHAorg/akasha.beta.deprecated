import { createSelector } from 'reselect';
import { List, Map } from 'immutable';

export const selectActiveDashboard = (state) => {
    const activeDashboard = state.dashboardState.get('activeDashboard');
    if (!activeDashboard) {
        return null;
    }
    return state.dashboardState.getIn([
        'byId',
        activeDashboard
    ]);
};

export const selectActiveDashboardColumns = (state) => {
    const id = state.dashboardState.get('activeDashboard');
    if (!id || !state.dashboardState.getIn(['byId', id])) {
        return new List();
    }
    return state.dashboardState
        .getIn(['byId', id, 'columns'])
        .map(columnId => selectColumn(state, columnId));
};

export const selectActiveDashboardId = state => state.dashboardState.get('activeDashboard');

export const selectAllDashboards = state =>
    state.dashboardState.get('allDashboards').map(id => selectDashboard(state, id));

export const selectDashboard = (state, id) =>
    state.dashboardState.getIn(['byId', id]);

export const selectDashboardIdByName = (state, name) =>
    state.dashboardState.get('byId')
        .filter(dashboard => dashboard.get('name') === name)
        .map(dashboard => dashboard.get('id'));

export const selectDashboards = (state) => {
    const search = selectDashboardSearch(state);
    if (!search) {
        return state.dashboardState.get('allDashboards').map(id => selectDashboard(state, id));
    }
    return state.dashboardState.get('allDashboards')
        .filter(id =>
            selectDashboard(state, id).get('name').toLowerCase().includes(search.toLowerCase())
        )
        .map(id => selectDashboard(state, id));
};

export const selectDashboardSearch = state => state.dashboardState.get('search');

export const selectColumn = (state, columnId) => state.dashboardState.getIn(['columnById', columnId]);

export const selectColumnEntries = (state, columnId) =>
    state.dashboardState
        .getIn(['columnById', columnId, 'itemsList'])
        .map(id => selectEntry(state, id));

export const selectColumnPendingEntries = (state, dashboardId) => {
    if (!dashboardId || !state.dashboardState.getIn(['byId', dashboardId])) {
        return new Map();
    }
    return state.dashboardState.getIn(['byId', dashboardId, 'columns']).map(colId =>
        state.entryState.getIn(['flags', 'pendingEntries', colId])
    );
}

export const selectColumnFirstBlock = (state, columnId) =>
    state.dashboardState.getIn(['columnById', columnId, 'firstBlock']);

export const selectColumnLastBlock = (state, columnId) =>
    state.dashboardState.getIn(['columnById', columnId, 'lastBlock']);

export const selectColumnLastEntry = (state, columnId) =>
    state.dashboardState.getIn(['columnById', columnId, 'itemsList']).last();

export const selectColumnLastIndex = (state, columnId) =>
    state.dashboardState.getIn(['columnById', columnId, 'lastIndex']);

export const selectColumns = state => state.dashboardState.get('columnById');
export const selectNewColumn = state => state.dashboardState.get('newColumn');

// export const selectNewColumnEntries = (state) => {
//     const entryIds = state.dashboardState.getIn(['columnById', 'newColumn', 'entries']);
//     return entryIds.map(id => selectEntry(state, id));
// };