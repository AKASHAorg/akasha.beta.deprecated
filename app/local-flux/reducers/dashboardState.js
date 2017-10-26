import { List } from 'immutable';
import * as types from '../constants';
import { createReducer } from './create-reducer';
import { ColumnRecord, DashboardRecord, DashboardState, NewColumnRecord } from './records';
import { COLUMN } from '../../constants/context-types';

const initialState = new DashboardState();

const entryIterator = (state, { columnId, value }) => {
    if (!columnId || !state.getIn(['columnById', columnId])) {
        return state;
    }
    if (columnId === 'newColumn') {
        return state.mergeIn(['columnById', columnId], {
            flags: state.getIn(['columnById', columnId, 'flags']).set('fetchingEntries', true),
            value
        });
    }
    return state.mergeIn(['columnById', columnId, 'flags'], { fetchingEntries: true });
};

const entryIteratorError = (state, { req }) => {
    if (!req.columnId || !state.getIn(['columnById', req.columnId])) {
        return state;
    }
    return state.mergeIn(['columnById', req.columnId, 'flags'], { fetchingEntries: false });
};

const entryIteratorSuccess = (state, { data, req }) => {
    if (!req.columnId || !state.getIn(['columnById', req.columnId])) {
        return state;
    }
    const entryIds = data.collection.map(entry => entry.entryId);

    return state.mergeIn(['columnById', req.columnId], {
        entries: new List(entryIds),
        flags: state.getIn(['columnById', req.columnId, 'flags']).merge({
            fetchingEntries: false,
            moreEntries: !!data.lastBlock
        }),
        lastBlock: data.lastBlock,
        lastIndex: data.lastIndex
    });
};

const entryMoreIterator = (state, { columnId }) => {
    if (!columnId || !state.getIn(['columnById', columnId])) {
        return state;
    }
    return state.mergeIn(['columnById', columnId, 'flags'], { fetchingMoreEntries: true });
};

const entryMoreIteratorError = (state, { req }) => {
    if (!req.columnId || !state.getIn(['columnById', req.columnId])) {
        return state;
    }
    return state.mergeIn(['columnById', req.columnId, 'flags'], { fetchingMoreEntries: false });
};

const entryMoreIteratorSuccess = (state, { data, req }) => {
    if (!req.columnId || !state.getIn(['columnById', req.columnId])) {
        return state;
    }
    const newIds = data.collection.map(entry => entry.entryId);

    return state.mergeIn(['columnById', req.columnId], {
        entries: state.getIn(['columnById', req.columnId, 'entries']).push(...newIds),
        flags: state.getIn(['columnById', req.columnId, 'flags']).merge({
            fetchingMoreEntries: false,
            moreEntries: !!data.lastBlock
        }),
        lastBlock: data.lastBlock || null,
        lastIndex: data.lastIndex
    });
};

const handleSuggestions = (state, { data, request }) => {
    const { context, columnId } = request;
    if (context === COLUMN) {
        const suggestions = new List(data);
        if (columnId && state.hasIn(['columnById', columnId])) {
            return state.setIn(['columnById', columnId, 'suggestions'], suggestions);
        }
        return state.setIn(['newColumn', 'suggestions'], suggestions);
    }
    return state;
};

const createDashboardRecord = (data) => {
    let dashboard = new DashboardRecord(data);
    dashboard = dashboard.set('columns', new List(dashboard.columns.map(col => col.id)));
    return dashboard;
};

const dashboardState = createReducer(initialState, {

    [types.DASHBOARD_ADD_COLUMN]: state =>
        state.merge({
            columnById: state.get('columnById').set('newColumn', new ColumnRecord()),
            newColumn: null
        }),

    [types.DASHBOARD_ADD_COLUMN_SUCCESS]: (state, { data }) =>
        state.merge({
            columnById: state.get('columnById').set(data.column.id, new ColumnRecord(data.column)),
            dashboardByName: state.get('dashboardByName').setIn(
                [data.dashboardName, 'columns'],
                state.getIn(['dashboardByName', data.dashboardName, 'columns']).push(data.column.id)
            )
        }),

    [types.DASHBOARD_ADD_FIRST_SUCCESS]: state => state.setIn(['flags', 'firstDashboardReady'], true),

    [types.DASHBOARD_ADD_NEW_COLUMN]: state =>
        state.set('newColumn', new NewColumnRecord()),

    [types.DASHBOARD_ADD_SUCCESS]: (state, { data }) => {
        let columnById = state.get('columnById');
        data.columns.forEach((column) => {
            columnById = columnById.set(column.id, new ColumnRecord(column));
        });
        return state.merge({
            activeDashboard: data.name,
            columnById,
            dashboardByName: state.get('dashboardByName').set(data.name, createDashboardRecord(data)),
        });
    },

    [types.DASHBOARD_DELETE_COLUMN_SUCCESS]: (state, { data }) => {
        const { name } = data.dashboard;
        const dashboardByName = state.get('dashboardByName').set(name, createDashboardRecord(data.dashboard));
        return state.merge({
            columnById: state.get('columnById').delete(data.columnId),
            dashboardByName
        });
    },

    [types.DASHBOARD_DELETE_NEW_COLUMN]: state => state.set('newColumn', null),

    [types.DASHBOARD_DELETE_SUCCESS]: (state, { data }) =>
        state.set('dashboardByName', state.get('dashboardByName').delete(data.name)),

    [types.DASHBOARD_GET_ACTIVE_SUCCESS]: (state, { data }) =>
        state.set('activeDashboard', data),

    [types.DASHBOARD_GET_ALL_SUCCESS]: (state, { data }) => {
        let dashboardByName = state.get('dashboardByName');
        let columnById = state.get('columnById');
        data.forEach((dashboard) => {
            dashboard.columns.forEach((column) => {
                columnById = columnById.set(column.id, new ColumnRecord(column));
            });
            dashboardByName = dashboardByName.set(dashboard.name, createDashboardRecord(dashboard));
        });
        return state.merge({
            columnById,
            dashboardByName
        });
    },

    [types.DASHBOARD_GET_PROFILE_SUGGESTIONS_SUCCESS]: handleSuggestions,

    [types.DASHBOARD_RESET_NEW_COLUMN]: state =>
        state.setIn(['columnById', 'newColumn'], new ColumnRecord()),

    [types.DASHBOARD_SEARCH]: (state, { query }) =>
        state.set('search', query),

    [types.DASHBOARD_SET_ACTIVE_SUCCESS]: (state, { data }) =>
        state.merge({
            activeDashboard: data,
            newColumn: null
        }),

    [types.DASHBOARD_TOGGLE_TAG_COLUMN_SUCCESS]: (state, { data }) => {
        let columnById = state.get('columnById');
        let dashboardByName = state.get('dashboardByName');
        data.columns.forEach((column) => {
            if (!columnById.get(column.id)) {
                columnById = columnById.set(column.id, new ColumnRecord(column));
            }
        });
        dashboardByName = dashboardByName.set(data.name, createDashboardRecord(data));
        return state.merge({
            columnById,
            dashboardByName
        });
    },

    [types.DASHBOARD_UPDATE_COLUMN_SUCCESS]: (state, { data }) =>
        state.mergeIn(['columnById', data.id], data.changes),

    [types.DASHBOARD_UPDATE_NEW_COLUMN]: (state, { changes }) =>
        state.mergeIn(['newColumn'], changes || NewColumnRecord()),

    [types.ENTRY_MORE_NEWEST_ITERATOR]: entryMoreIterator,

    [types.ENTRY_MORE_NEWEST_ITERATOR_ERROR]: entryMoreIteratorError,

    [types.ENTRY_MORE_NEWEST_ITERATOR_SUCCESS]: entryMoreIteratorSuccess,

    [types.ENTRY_MORE_PROFILE_ITERATOR]: entryMoreIterator,

    [types.ENTRY_MORE_PROFILE_ITERATOR_ERROR]: entryMoreIteratorError,

    [types.ENTRY_MORE_PROFILE_ITERATOR_SUCCESS]: entryMoreIteratorSuccess,

    [types.ENTRY_MORE_STREAM_ITERATOR]: entryMoreIterator,

    [types.ENTRY_MORE_STREAM_ITERATOR_ERROR]: entryMoreIteratorError,

    [types.ENTRY_MORE_STREAM_ITERATOR_SUCCESS]: entryMoreIteratorSuccess,

    [types.ENTRY_MORE_TAG_ITERATOR]: entryMoreIterator,

    [types.ENTRY_MORE_TAG_ITERATOR_ERROR]: entryMoreIteratorError,

    [types.ENTRY_MORE_TAG_ITERATOR_SUCCESS]: entryMoreIteratorSuccess,

    [types.ENTRY_NEWEST_ITERATOR]: entryIterator,

    [types.ENTRY_NEWEST_ITERATOR_ERROR]: entryIteratorError,

    [types.ENTRY_NEWEST_ITERATOR_SUCCESS]: entryIteratorSuccess,

    [types.ENTRY_PROFILE_ITERATOR]: entryIterator,

    [types.ENTRY_PROFILE_ITERATOR_ERROR]: entryIteratorError,

    [types.ENTRY_PROFILE_ITERATOR_SUCCESS]: entryIteratorSuccess,

    [types.ENTRY_STREAM_ITERATOR]: entryIterator,

    [types.ENTRY_STREAM_ITERATOR_ERROR]: entryIteratorError,

    [types.ENTRY_STREAM_ITERATOR_SUCCESS]: entryIteratorSuccess,

    [types.ENTRY_TAG_ITERATOR]: entryIterator,

    [types.ENTRY_TAG_ITERATOR_ERROR]: entryIteratorError,

    [types.ENTRY_TAG_ITERATOR_SUCCESS]: entryIteratorSuccess,

    [types.PROFILE_LOGOUT_SUCCESS]: () => initialState
});

export default dashboardState;
