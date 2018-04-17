// @flow
import { List, fromJS } from 'immutable';
import { differenceWith } from 'ramda';
import * as types from '../constants';
import { createReducer } from './create-reducer';
import { ColumnRecord, DashboardRecord, DashboardState, NewColumnRecord } from './records';
import { newColumn as newColumnType, list as listColumnType } from '../../constants/columns';
const initialState = new DashboardState();

const entryIterator = (state, { column }) => {
    const { id, value, reversed } = column;
    if (reversed || !id || !state.getIn(['columnById', id])) {
        return state;
    }
    if (id === newColumnType) {
        return state.mergeIn(['columnById', id], {
            flags: state.getIn(['columnById', id, 'flags']).set('fetchingEntries', true),
            value,
            id
        });
    }
    return state.mergeIn(['columnById', id], {
        flags: state.getIn(['columnById', id, 'flags']).set('fetchingEntries', true)
    });
};

const entryIteratorError = (state, { request }) => {
    if (request.reversed || !request.columnId || !state.getIn(['columnById', request.columnId])) {
        return state;
    }
    return state.mergeIn(['columnById', request.columnId, 'flags'], { fetchingEntries: false });
};

const entryIteratorSuccess = (state, { data, type, request }) => {
    if (!request.columnId || !state.getIn(['columnById', request.columnId])) {
        return state;
    }

    if (request.reversed) {
        const diffFn = (x, y) => x === y;
        const diffArr = differenceWith(
            diffFn,
            data.collection.map(entry => entry.entryId),
            state.getIn(['columnById', request.columnId, 'newEntries']).toJS()
        );
        return state.mergeIn(['columnById', request.columnId], {
            newEntries: state.getIn(['columnById', request.columnId, 'newEntries']).unshift(...diffArr),
            firstBlock: data.lastBlock,
            firstIndex: data.lastIndex,
        });
    }

    const entryIds = data.collection.map(entry => entry.entryId);
    const moreEntries = type === types.ENTRY_LIST_ITERATOR_SUCCESS ?
        request.limit === data.collection.length :
        !!data.lastBlock;
    return state.mergeIn(['columnById', request.columnId], {
        entriesList: List(entryIds),
        firstBlock: request.toBlock + 1,
        flags: state.getIn(['columnById', request.columnId, 'flags']).merge({
            fetchingEntries: false,
            moreEntries
        }),
        lastBlock: data.lastBlock,
        lastIndex: data.lastIndex
    });
};

const entryMoreIterator = (state, { column }) => {
    const { id } = column;
    if (!id || !state.getIn(['columnById', id])) {
        return state;
    }
    return state.mergeIn(['columnById', id, 'flags'], { fetchingMoreEntries: true });
};

const entryMoreIteratorError = (state, { request }) => {
    if (!request.columnId || !state.getIn(['columnById', request.columnId])) {
        return state;
    }
    return state.mergeIn(['columnById', request.columnId, 'flags'], { fetchingMoreEntries: false });
};

const entryMoreIteratorSuccess = (state, { data, request, type }) => {
    if (!request.columnId || !state.getIn(['columnById', request.columnId])) {
        return state;
    }
    /**
     * In some cases this action is fired as a result of a previous fetch
     * for example: user rapidly refreshes a column...
     * To prevent that, make sure we already have something in entriesList
     */
    if(state.getIn(['columnById', request.columnId, 'entriesList']).size === 0) {
        return state;
    }

    const newIds = data.collection.map(entry => entry.entryId);
    const moreEntries = type === types.ENTRY_MORE_LIST_ITERATOR_SUCCESS ?
        request.limit === data.collection.length :
        !!data.lastBlock;
    return state.mergeIn(['columnById', request.columnId], {
        entriesList: state.getIn(['columnById', request.columnId, 'entriesList']).push(...newIds),
        flags: state.getIn(['columnById', request.columnId, 'flags']).merge({
            fetchingMoreEntries: false,
            moreEntries
        }),
        lastBlock: data.lastBlock || null,
        lastIndex: data.lastIndex
    });
};

const createDashboardRecord = (data) => {
    let dashboard = new DashboardRecord(data);
    dashboard = dashboard.set('columns', List(dashboard.columns.map(col => col.id)));
    return dashboard;
};

const dashboardState = createReducer(initialState, {

    [types.DASHBOARD_ADD_COLUMN]: state =>
        state.merge({
            columnById: state.get('columnById').set(newColumnType, new ColumnRecord()),
            [newColumnType]: null
        }),

    [types.DASHBOARD_ADD_COLUMN_SUCCESS]: (state, { data }) =>
        state.merge({
            columnById: state.get('columnById').set(data.column.id, new ColumnRecord(data.column)),
            byId: state.get('byId').setIn(
                [data.dashboardId, 'columns'],
                state.getIn(['byId', data.dashboardId, 'columns']).push(data.column.id)
            )
        }),

    [types.DASHBOARD_ADD_FIRST_SUCCESS]: state => state.setIn(['flags', 'firstDashboardReady'], true),

    [types.DASHBOARD_ADD_NEW_COLUMN]: state =>
        state.set(newColumnType, new NewColumnRecord()),

    [types.DASHBOARD_ADD_SUCCESS]: (state, { data }) => {
        let columnById = state.get('columnById');
        data.columns.forEach((column) => {
            columnById = columnById.set(column.id, new ColumnRecord(column));
        });
        return state.merge({
            activeDashboard: data.id,
            allDashboards: state.get('allDashboards').push(data.id),
            byId: state.get('byId').set(data.id, createDashboardRecord(data)),
            columnById,
        });
    },

    [types.DASHBOARD_CREATE_NEW]: state => state.set('newDashboard', true),

    [types.DASHBOARD_DELETE_NEW]: state => state.set('newDashboard', false),

    [types.DASHBOARD_DELETE_COLUMN_SUCCESS]: (state, { data }) => {
        const { id } = data.dashboard;
        const byId = state.get('byId').set(id, createDashboardRecord(data.dashboard));
        return state.merge({
            byId,
            columnById: state.get('columnById').delete(data.columnId),
        });
    },

    [types.DASHBOARD_DELETE_NEW_COLUMN]: state => state.set(newColumnType, null),

    [types.DASHBOARD_DELETE_SUCCESS]: (state, { data }) =>
        state.merge({
            allDashboards: state.get('allDashboards').filter(id => id !== data.id),
            byId: state.get('byId').delete(data.id)
        }),

    [types.DASHBOARD_GET_ACTIVE_SUCCESS]: (state, { data }) =>
        state.set('activeDashboard', data),

    [types.DASHBOARD_GET_ALL_SUCCESS]: (state, { data }) => {
        let allDashboards = List();
        let byId = state.get('byId');
        let columnById = state.get('columnById');
        data.forEach((dashboard) => {
            dashboard.columns.forEach((column) => {
                // if a column is broken (aka wrongly saved in db) just skip it
                if (column && column.id) {
                    columnById = columnById.set(column.id, new ColumnRecord(column));
                }
            });
            byId = byId.set(dashboard.id, createDashboardRecord(dashboard));
            allDashboards = allDashboards.push(dashboard.id);
        });
        return state.merge({
            allDashboards,
            byId,
            columnById,
        });
    },

    [types.DASHBOARD_HIDE_TUTORIAL]: state => state.setIn(['flags', 'firstDashboardReady'], false),

    [types.DASHBOARD_RENAME]: state => state.setIn(['flags', 'renamingDashboard'], true),

    [types.DASHBOARD_RENAME_SUCCESS]: (state, { data }) =>
        state.merge({
            byId: state.get('byId').setIn([data.dashboardId, 'name'], data.newName),
            flags: state.get('flags').set('renamingDashboard', false)
        }),

    [types.DASHBOARD_REORDER_COLUMN]: (state, { data }) => {
        const columns = state.getIn(['byId', data.dashboardId, 'columns']);
        const first = columns.splice(data.sourceIndex, 1);
        const second = first.splice(data.targetIndex, 0, columns.get(data.sourceIndex));
        return state.merge({
            byId: state.get('byId').setIn([data.dashboardId, 'columns'], second)
        });
    },

    [types.DASHBOARD_REORDER]: (state, { data }) => {
        const columns = state.get(['allDashboards']);
        const first = columns.splice(data.sourceIndex, 1);
        const second = first.splice(data.targetIndex, 0, columns.get(data.sourceIndex));
        return state.merge({
            allDashboards: second
        });
    },

    [types.DASHBOARD_RESET_COLUMN_ENTRIES]: (state, { columnId }) => {
        if (state.getIn(['columnById', columnId])) {
            return state.setIn(['columnById', columnId, 'entriesList'], List());
        }
        return state;
    },

    [types.DASHBOARD_RESET_NEW_COLUMN]: state =>
        state.setIn(['columnById', newColumnType], new ColumnRecord()),

    [types.DASHBOARD_SEARCH]: (state, { query }) =>
        state.set('search', query),

    [types.DASHBOARD_SET_ACTIVE_SUCCESS]: (state, { data }) =>
        state.merge({
            activeDashboard: data,
            [newColumnType]: null
        }),

    [types.DASHBOARD_TOGGLE_PROFILE_COLUMN_SUCCESS]: (state, { data }) => {
        let columnById = state.get('columnById');
        let byId = state.get('byId');
        data.columns.forEach((column) => {
            if (!columnById.get(column.id)) {
                columnById = columnById.set(column.id, new ColumnRecord(column));
            }
        });
        byId = byId.set(data.id, createDashboardRecord(data));
        return state.merge({
            byId,
            columnById,
        });
    },

    [types.DASHBOARD_TOGGLE_TAG_COLUMN_SUCCESS]: (state, { data }) => {
        let columnById = state.get('columnById');
        let byId = state.get('byId');
        data.columns.forEach((column) => {
            if (!columnById.get(column.id)) {
                columnById = columnById.set(column.id, new ColumnRecord(column));
            }
        });
        byId = byId.set(data.id, createDashboardRecord(data));
        return state.merge({
            byId,
            columnById,
        });
    },

    [types.DASHBOARD_UPDATE_COLUMN_SUCCESS]: (state, { data }) =>
        state.mergeIn(['columnById', data.id], data.changes),

    [types.DASHBOARD_UPDATE_NEW_COLUMN]: (state, { changes }) =>
        state.mergeIn([newColumnType], changes || NewColumnRecord()),

    [types.ENTRY_LIST_ITERATOR]: entryIterator,

    [types.ENTRY_LIST_ITERATOR_SUCCESS]: entryIteratorSuccess,

    [types.ENTRY_MORE_LIST_ITERATOR]: entryMoreIterator,

    [types.ENTRY_MORE_LIST_ITERATOR_SUCCESS]: entryMoreIteratorSuccess,

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

    [types.ENTRY_GET_SHORT_SUCCESS]: (state, { request }) => {
        const { context, entryId } = request;
        if (
            context &&
            state.getIn(['columnById', context, 'newEntries']) &&
            state.getIn(['columnById', context, 'newEntries']).includes(entryId)
        ) {
            let mState = state.deleteIn(
                ['columnById', context, 'newEntries'],
                state.getIn(['columnById', context, 'newEntries']).indexOf(entryId)
            )
            mState = mState.mergeIn(['columnById', context], {
                entriesList: state.getIn(['columnById', context, 'entriesList']).unshift(entryId)
            });
            return mState;
        }
        return state;
    },
    [types.ENTRY_GET_SHORT_ERROR]: (state, { request }) => {
        const { context, entryId } = request;
        if (context &&
            state.getIn(['columnById', context, 'newEntries']) &&
            state.getIn(['columnById', context, 'newEntries']).includes(entryId)
        ) {
            let mState = state.deleteIn(['columnById', context, 'newEntries'], entryId)
            mState = mState.mergeIn(['columnById', context], {
                entriesList: state.getIn(['columnById', context, 'entriesList']).unshift(entryId)
            });
            return mState;
        }
        return state;
    },
    [types.HIDE_PREVIEW]: state =>
        state.setIn(['columnById', 'previewColumn'], new ColumnRecord()),

    [types.LIST_TOGGLE_ENTRY_SUCCESS]: (state, { data, request }) => {
        const { entryId } = request;
        const listColumns = state
            .get('columnById')
            .filter(column => (column.type === null || column.type === listColumnType) &&
                column.value === data.id);
        if (listColumns.size) {
            listColumns.map((listColumn) => {
                const columnId = (listColumn.id) ? listColumn.id : 'newColumn';
                const hasEntryId = listColumn.entriesList.includes(entryId);
                if (hasEntryId) {
                    state = state.setIn(
                        ['columnById', columnId, 'entriesList'],
                        listColumn.entriesList.filter(id => id !== entryId)
                    );
                } else {
                    state = state.setIn(
                        ['columnById', columnId, 'entriesList'],
                        listColumn.entriesList.push(entryId)
                    );
                }
            });
        }
        return state;
    },

    [types.PROFILE_LOGOUT_SUCCESS]: () => initialState,

    [types.SHOW_PREVIEW]: (state, { columnType, value }) =>
        state.setIn(['columnById', 'previewColumn'], new ColumnRecord({
            id: 'previewColumn',
            type: columnType,
            value
        })),
});

export default dashboardState;
