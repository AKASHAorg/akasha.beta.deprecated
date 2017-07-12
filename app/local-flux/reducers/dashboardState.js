import { List } from 'immutable';
import * as types from '../constants';
import { createReducer } from './create-reducer';
import { ColumnRecord, DashboardRecord, DashboardState, NewColumnRecord } from './records';
import { COLUMN } from '../../constants/context-types';

const initialState = new DashboardState();

const entryIterator = (state, { columnId }) => {
    if (!columnId || !state.getIn(['columnById', columnId])) {
        return state;
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
    const moreEntries = req.limit === data.collection.length;
    const entryIds = data.collection.map(entry => entry.entryId);
    // the request is made for n + 1 entries to determine if there are more entries left
    // if this is the case, drop the extra entry
    if (moreEntries) {
        entryIds.pop();
    }
    return state.mergeIn(['columnById', req.columnId], {
        entries: new List(entryIds),
        flags: state.getIn(['columnById', req.columnId, 'flags']).merge({
            fetchingEntries: false,
            moreEntries
        }),
        lastBlock: data.lastBlock || null
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
    const moreEntries = data.limit === data.collection.length;
    const newIds = data.collection.map(entry => entry.entryId);
    // the request is made for n + 1 entries to determine if there are more entries left
    // if this is the case, drop the extra entry
    if (moreEntries) {
        newIds.pop();
    }
    return state.mergeIn(['columnById', req.columnId], {
        entries: state.getIn(['columnById', req.columnId, 'entries']).push(...newIds),
        flags: state.getIn(['columnById', req.columnId, 'flags']).merge({
            fetchingMoreEntries: false,
            moreEntries
        }),
        lastBlock: data.lastBlock || null
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

const dashboardState = createReducer(initialState, {

    [types.DASHBOARD_ADD_COLUMN]: state =>
        state.set('newColumn', null),

    [types.DASHBOARD_ADD_COLUMN_SUCCESS]: (state, { data }) =>
        state.merge({
            columnById: state.get('columnById').set(data.id, new ColumnRecord(data)),
            dashboardById: state.get('dashboardById').setIn(
                [data.dashboardName, 'columns'],
                state.getIn(['dashboardById', data.dashboardName, 'columns']).push(data.id)
            )
        }),

    [types.DASHBOARD_ADD_NEW_COLUMN]: state =>
        state.set('newColumn', new NewColumnRecord()),

    [types.DASHBOARD_ADD_SUCCESS]: (state, { data }) =>
        state.merge({
            activeDashboard: data.name,
            dashboardById: state.get('dashboardById').set(data.name, new DashboardRecord(data)),
        }),

    [types.DASHBOARD_DELETE_COLUMN_SUCCESS]: (state, { data }) => {
        const oldDashboard = state.getIn(['dashboardById', data.dashboardName]);
        const index = oldDashboard.get('columns').indexOf(data.columnId);
        return state.merge({
            columnById: state.get('columnById').delete(data.columnId),
            dashboardById: state.get('dashboardById').setIn(
                [data.dashboardName, 'columns'],
                oldDashboard.get('columns').delete(index)
            )
        });
    },

    [types.DASHBOARD_DELETE_SUCCESS]: (state, { data }) =>
        state.set('dashboardById', state.get('dashboardById').delete(data.name)),

    [types.DASHBOARD_GET_ACTIVE_SUCCESS]: (state, { data }) =>
        state.set('activeDashboard', data),

    [types.DASHBOARD_GET_ALL_SUCCESS]: (state, { data }) => {
        let dashboardById = state.get('dashboardById');
        data.forEach((dashboard) => {
            // convert the columns array to List
            dashboard.columns = new List(dashboard.columns);
            dashboardById = dashboardById.set(dashboard.name, new DashboardRecord(dashboard));
        });
        return state.set('dashboardById', dashboardById);
    },

    [types.DASHBOARD_GET_COLUMNS_SUCCESS]: (state, { data }) => {
        let columnById = state.get('columnById');
        data.forEach((column) => {
            columnById = columnById.set(column.id, new ColumnRecord(column));
        });
        return state.set('columnById', columnById);
    },

    [types.DASHBOARD_GET_PROFILE_SUGGESTIONS_SUCCESS]: handleSuggestions,

    [types.DASHBOARD_GET_TAG_SUGGESTIONS_SUCCESS]: handleSuggestions,

    [types.DASHBOARD_SET_ACTIVE_SUCCESS]: (state, { data }) =>
        state.merge({
            activeDashboard: data,
            newColumn: null
        }),

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
