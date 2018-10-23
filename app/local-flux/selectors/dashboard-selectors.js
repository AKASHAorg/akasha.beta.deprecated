//@flow
import { createSelector } from 'reselect';
import { List, Map } from 'immutable';
import { selectEntryById, selectPendingEntriesFlags } from './entry-selectors';

/*::
    type DashboardByIdProps = {
        dashboardId: string
    }
    type ColumnByIdProps = {
        columnId: string
    }
    type ColBlockProps = {
        columnId: string
    }
 */

export const selectDashboardsById = (state/*: Object */) => state.dashboardState.get('byId');
export const selectDashboardById = (state/*: Object */, props/*: DashboardByIdProps */) =>
    state.dashboardState.getIn(['byId', props.dashboardId]);
export const selectActiveDashboardId = (state/*: Object */) => state.dashboardState.get('activeDashboard');
export const selectColumnById = (state/*: Object */, props/*: ColumnByIdProps */) =>
    state.dashboardState.getIn(['columnById', props.columnId]);
export const selectColumns = (state/*: Object */) => state.dashboardState.get('columnById');
export const selectDashboardSearch = (state/*: Object */) => state.dashboardState.get('search');
export const selectAllDashboardIds = (state/*: Object */) => state.dashboardState.get('allDashboards');
export const selectNewColumn = (state/*: Object */) => state.dashboardState.get('newColumn');

export const selectColumnFirstBlock = (state/*: Object */, props/*: ColBlockProps */) =>
    selectColumnById(state, props).get('firstBlock');
export const selectColumnLastBlock = (state/*: Object */, props/*: ColBlockProps */) =>
    selectColumnById(state, props).get('lastBlock');
export const selectColumnLastEntry = (state/*: Object */, props/*: ColBlockProps */) =>
    selectColumnById(state, props).get('itemList').last();
export const selectColumnLastIndex = (state/*: Object */, props/*: ColBlockProps */) =>
    selectColumnById(state, props).get('lastIndex');

export const getActiveDashboard = createSelector(
    [selectDashboardsById, selectActiveDashboardId],
    (dashboards, activeDashboardId) => {
        if(activeDashboardId) {
            return dashboards.get(activeDashboardId);
        }
        return null;
    }
);

export const getActiveDashboardColumns = createSelector(
    [getActiveDashboard, selectColumns],
    (activeDashboard/*: Object */, columns/*: Object */) => {
        if(activeDashboard) {
            return activeDashboard
                .get('columns')
                .map(colId => columns.get(colId))
        }
        return new List();
    }
);

export const getAllDashboards = createSelector(
    [selectAllDashboardIds, selectDashboardsById],
    (dashboardIds/*: List<string> */, dashboards/*: Object */) =>
        dashboardIds.map(id => dashboards.get(id))
);
export const getDashboardIdByName = (state/*: Object */, name/*: string */) =>
    selectDashboardsById(state)
        .filter((dashboard/*: Object */) => dashboard.get('name') === name)
        .map((dashboard/*: Object */) => dashboard.get('id'));

// @todo Not sure how is this useful...
export const getDashboards = createSelector(
    [selectDashboardSearch, selectAllDashboardIds],
    (searchTerm/*: string */, allDashboards/*: Object */) => {
        if(!searchTerm) {
            return allDashboards;
        }
        return allDashboards
            .filter(dashboard => 
                dashboard.get('name').toLowerCase().includes(searchTerm.toLowerCase())
            );
    }
);

export const getColumnEntries = (state/*: Object */, columnId/*: string */) =>
    selectColumns(state)
        .getIn([columnId, 'itemsList'])
        .map(entryId => selectEntryById(state, entryId));

// @todo -> get rid of FLAAAG
export const getDashboardColumnsPendingEntries = createSelector(
    [selectDashboardById, selectPendingEntriesFlags],
    (dashboard, pendingEntriesFlags) => {
        if(dashboard) {
            return dashboard.get('columns').map(colId => {
                pendingEntriesFlags.get(colId);
            });
        }
        return new Map();
    });

// export const selectNewColumnEntries = (state) => {
//     const entryIds = state.dashboardState.getIn(['columnById', 'newColumn', 'entries']);
//     return entryIds.map(id => selectEntry(state, id));
// };