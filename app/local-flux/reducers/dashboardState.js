import { List } from 'immutable';
import * as types from '../constants';
import { createReducer } from './create-reducer';
import { ColumnRecord, DashboardRecord, DashboardState } from './records';

const initialState = new DashboardState();

const entryIterator = (state, { id }) => {
    if (!id || !state.getIn(['columnById', id])) {
        return state;
    }
    return state.mergeIn(['columnById', id, 'flags'], { fetchingEntries: true });
};

const entryIteratorError = (state, { req }) => {
    if (!req.id || !state.getIn(['columnById', req.id])) {
        return state;
    }
    return state.mergeIn(['columnById', req.id, 'flags'], { fetchingEntries: false });
};

const entryIteratorSuccess = (state, { data, req }) => {
    if (!req.id || !state.getIn(['columnById', req.id])) {
        return state;
    }
    const moreEntries = req.limit === data.collection.length;
    const entryIds = data.collection.map(entry => entry.entryId);
    // the request is made for n + 1 entries to determine if there are more entries left
    // if this is the case, drop the extra entry
    if (moreEntries) {
        entryIds.pop();
    }
    return state.mergeIn(['columnById', req.id], {
        entries: new List(entryIds),
        flags: state.getIn(['columnById', req.id, 'flags']).merge({
            fetchingEntries: false,
            moreEntries
        }),
        lastBlock: data.lastBlock || null
    });
};

const entryMoreIterator = (state, { id }) => {
    if (!id || !state.getIn(['columnById', id])) {
        return state;
    }
    return state.mergeIn(['columnById', id, 'flags'], { fetchingMoreEntries: true });
};

const entryMoreIteratorError = (state, { req }) => {
    if (!req.id || !state.getIn(['columnById', req.id])) {
        return state;
    }
    return state.mergeIn(['columnById', req.id, 'flags'], { fetchingMoreEntries: false });
};

const entryMoreIteratorSuccess = (state, { data, req }) => {
    if (!req.id || !state.getIn(['columnById', req.id])) {
        return state;
    }
    const moreEntries = data.limit === data.collection.length;
    const newIds = data.collection.map(entry => entry.entryId);
    // the request is made for n + 1 entries to determine if there are more entries left
    // if this is the case, drop the extra entry
    if (moreEntries) {
        newIds.pop();
    }
    return state.mergeIn(['columnById', req.id], {
        entries: state.getIn(['columnById', req.id, 'entries']).push(...newIds),
        flags: state.getIn(['columnById', req.id, 'flags']).merge({
            fetchingMoreEntries: false,
            moreEntries
        }),
        lastBlock: data.lastBlock || null
    });
};

const dashboardState = createReducer(initialState, {

    [types.DASHBOARD_ADD_SUCCESS]: (state, { data }) =>
        state.merge({
            activeDashboard: data.id,
            dashboardById: state.get('dashboardById').set(data.id, new DashboardRecord(data)),
        }),

    [types.DASHBOARD_ADD_COLUMN_SUCCESS]: (state, { data }) =>
        state.merge({
            columnById: state.get('columnById').set(data.id, new ColumnRecord(data)),
            dashboardById: state.get('dashboardById').setIn(
                [data.dashboardId, 'columns'],
                state.getIn(['dashboardById', data.dashboardId, 'columns']).push(data.id)
            )
        }),

    [types.DASHBOARD_DELETE_COLUMN_SUCCESS]: (state, { data }) => {
        const oldDashboard = state.getIn(['dashboardById', data.dashboardId]);
        const index = oldDashboard.get('columns').indexOf(data.columnId);
        return state.merge({
            columnById: state.get('columnById').delete(data.columnId),
            dashboardById: state.get('dashboardById').setIn(
                [data.dashboardId, 'columns'],
                oldDashboard.get('columns').delete(index)
            )
        });
    },

    [types.DASHBOARD_DELETE_SUCCESS]: (state, { data }) =>
        state.set('dashboardById', state.get('dashboardById').delete(data.id)),

    [types.DASHBOARD_GET_ACTIVE_SUCCESS]: (state, { data }) =>
        state.set('activeDashboard', data),

    [types.DASHBOARD_GET_ALL_SUCCESS]: (state, { data }) => {
        let dashboardById = state.get('dashboardById');
        data.forEach((dashboard) => {
            // convert the columns array to List
            dashboard.columns = new List(dashboard.columns);
            dashboardById = dashboardById.set(dashboard.id, new DashboardRecord(dashboard));
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

    [types.DASHBOARD_SET_ACTIVE_SUCCESS]: (state, { data }) =>
        state.set('activeDashboard', data),

    [types.DASHBOARD_UPDATE_COLUMN_SUCCESS]: (state, { data }) =>
        state.setIn(['columnById', data.id, 'value'], data.value),

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
});

export default dashboardState;
