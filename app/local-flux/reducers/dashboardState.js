// @flow
import { List } from 'immutable';
import { createReducer } from './utils';
import DashboardStateModel, { ColumnRecord, NewColumnRecord } from './state-models/dashboard-state-model';
import * as columnTypes from '../../constants/columns';
import * as types from '../constants';


const initialState = new DashboardStateModel();

const dashboardState = createReducer(initialState, {

    [types.DASHBOARD_ADD_COLUMN]: state =>
        state.merge({
            columnById: state.get('columnById').set(columnTypes.newColumn, new ColumnRecord()),
            [columnTypes.newColumn]: null
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
        state.set(columnTypes.newColumn, new NewColumnRecord()),

    [types.DASHBOARD_ADD_SUCCESS]: (state, { data }) => {
        let columnById = state.get('columnById');
        data.columns.forEach((column) => {
            columnById = columnById.set(column.id, new ColumnRecord(column));
        });
        return state.merge({
            activeDashboard: data.id,
            allDashboards: state.get('allDashboards').push(data.id),
            byId: state.get('byId').set(data.id, state.createDashboardRecord(data)),
            columnById,
        });
    },

    [types.DASHBOARD_CREATE_NEW]: state => state.set('newDashboard', true),

    [types.DASHBOARD_DELETE_NEW]: state => state.set('newDashboard', false),

    [types.DASHBOARD_DELETE_COLUMN_SUCCESS]: (state, { data }) => {
        const { id } = data.dashboard;
        const byId = state.get('byId').set(id, state.createDashboardRecord(data.dashboard));
        return state.merge({
            byId,
            columnById: state.get('columnById').delete(data.columnId),
        });
    },

    [types.DASHBOARD_DELETE_NEW_COLUMN]: state => state.set(columnTypes.newColumn, null),

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
            byId = byId.set(dashboard.id, state.createDashboardRecord(dashboard));
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
            return state.setIn(['columnById', columnId, 'itemsList'], List());
        }
        return state;
    },

    [types.DASHBOARD_RESET_NEW_COLUMN]: state =>
        state.setIn(['columnById', columnTypes.newColumn], new ColumnRecord()),

    [types.DASHBOARD_RESET_PROFILE_COLUMNS]: (state) => {
        const { profileComments, profileFollowers, profileFollowings } = columnTypes;
        return state.mergeIn(['columnById'], {
            profileComments: new ColumnRecord({ id: profileComments, type: profileComments }),
            profileFollowers: new ColumnRecord({ id: profileFollowers, type: profileFollowers }),
            profileFollowings: new ColumnRecord({ id: profileFollowings, type: profileFollowings }),
        });
    },

    [types.DASHBOARD_SEARCH]: (state, { query }) =>
        state.set('search', query),

    [types.DASHBOARD_SET_ACTIVE_SUCCESS]: (state, { data }) =>
        state.merge({
            activeDashboard: data,
            [columnTypes.newColumn]: null
        }),

    [types.DASHBOARD_TOGGLE_PROFILE_COLUMN_SUCCESS]: (state, { data }) => {
        let columnById = state.get('columnById');
        let byId = state.get('byId');
        data.columns.forEach((column) => {
            if (!columnById.get(column.id)) {
                columnById = columnById.set(column.id, new ColumnRecord(column));
            }
        });
        byId = byId.set(data.id, state.createDashboardRecord(data));
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
        byId = byId.set(data.id, state.createDashboardRecord(data));
        return state.merge({
            byId,
            columnById,
        });
    },

    [types.DASHBOARD_UPDATE_COLUMN_SUCCESS]: (state, { data }) =>
        state.mergeIn(['columnById', data.id], data.changes),

    [types.DASHBOARD_UPDATE_NEW_COLUMN]: (state, { changes }) =>
        state.mergeIn([columnTypes.newColumn], changes || NewColumnRecord()),

    // [types.ENTRY_LIST_ITERATOR]: itemIterator,

    // [types.ENTRY_LIST_ITERATOR_SUCCESS]: entryIteratorSuccess,

    [types.ENTRY_MORE_LIST_ITERATOR]: (state) => state.itemMoreIterator(state),

    [types.ENTRY_MORE_LIST_ITERATOR_SUCCESS]: (state) => state.entryMoreIteratorSuccess(state),

    [types.ENTRY_MORE_NEWEST_ITERATOR]: (state) => state.itemMoreIterator(state),

    [types.ENTRY_MORE_NEWEST_ITERATOR_ERROR]: (state) => state.itemMoreIteratorError(state),

    [types.ENTRY_MORE_NEWEST_ITERATOR_SUCCESS]: (state) => state.entryMoreIteratorSuccess(state),

    [types.ENTRY_MORE_PROFILE_ITERATOR]: (state) => state.itemMoreIterator(state),

    [types.ENTRY_MORE_PROFILE_ITERATOR_ERROR]: (state) => state.itemMoreIteratorError(state),

    [types.ENTRY_MORE_PROFILE_ITERATOR_SUCCESS]: (state) => state.entryMoreIteratorSuccess(state),

    [types.ENTRY_MORE_STREAM_ITERATOR]: (state) => state.itemMoreIterator(state),

    [types.ENTRY_MORE_STREAM_ITERATOR_ERROR]: (state) => state.itemMoreIteratorError(state),

    [types.ENTRY_MORE_STREAM_ITERATOR_SUCCESS]: (state) => state.entryMoreIteratorSuccess(state),

    [types.ENTRY_MORE_TAG_ITERATOR]: (state) => state.itemMoreIterator(state),

    [types.ENTRY_MORE_TAG_ITERATOR_ERROR]: (state) => state.itemMoreIteratorError(state),

    [types.ENTRY_MORE_TAG_ITERATOR_SUCCESS]: (state) => state.entryMoreIteratorSuccess(state),

    [types.ENTRY_NEWEST_ITERATOR]: (state) => state.itemIterator(state),

    [types.ENTRY_NEWEST_ITERATOR_ERROR]: (state) => state.itemIteratorError(state),

    [types.ENTRY_NEWEST_ITERATOR_SUCCESS]: (state) => state.entryIteratorSuccess(state),

    [types.ENTRY_PROFILE_ITERATOR]: (state) => state.itemIterator(state),

    [types.ENTRY_PROFILE_ITERATOR_ERROR]: (state) => state.itemIteratorError(state),

    [types.ENTRY_PROFILE_ITERATOR_SUCCESS]: (state) => state.entryIteratorSuccess(state),

    // [types.ENTRY_STREAM_ITERATOR]: itemIterator,

    // [types.ENTRY_STREAM_ITERATOR_ERROR]: itemIteratorError,

    // [types.ENTRY_STREAM_ITERATOR_SUCCESS]: entryIteratorSuccess,

    // [types.ENTRY_TAG_ITERATOR]: itemIterator,

    // [types.ENTRY_TAG_ITERATOR_ERROR]: itemIteratorError,

    // [types.ENTRY_TAG_ITERATOR_SUCCESS]: entryIteratorSuccess,

    // [types.ENTRY_GET_SHORT_SUCCESS]: (state, { request }) => {
    //     const { context, entryId } = request;
    //     if (
    //         context &&
    //         state.getIn(['columnById', context, 'newItems']) &&
    //         state.getIn(['columnById', context, 'newItems']).includes(entryId)
    //     ) {
    //         let mState = state.deleteIn(
    //             ['columnById', context, 'newItems'],
    //             state.getIn(['columnById', context, 'newItems']).indexOf(entryId)
    //         )
    //         mState = mState.mergeIn(['columnById', context], {
    //             itemsList: state.getIn(['columnById', context, 'itemsList']).unshift(entryId)
    //         });
    //         return mState;
    //     }
    //     return state;
    // },
    // [types.ENTRY_GET_SHORT_ERROR]: (state, { request }) => {
    //     const { context, entryId } = request;
    //     if (context &&
    //         state.getIn(['columnById', context, 'newItems']) &&
    //         state.getIn(['columnById', context, 'newItems']).includes(entryId)
    //     ) {
    //         let mState = state.deleteIn(['columnById', context, 'newItems'], entryId)
    //         mState = mState.mergeIn(['columnById', context], {
    //             itemsList: state.getIn(['columnById', context, 'itemsList']).unshift(entryId)
    //         });
    //         return mState;
    //     }
    //     return state;
    // },
    [types.HIDE_PREVIEW]: state =>
        state.setIn(['columnById', 'previewColumn'], new ColumnRecord()),

    [types.LIST_TOGGLE_ENTRY_SUCCESS]: (state, { data, request }) => {
        const { entryId } = request;
        const listColumns = state
            .get('columnById')
            .filter(column => (column.type === null || column.type === columnTypes.list) &&
                column.value === data.id);
        if (listColumns.size) {
            listColumns.map((listColumn) => {
                const columnId = (listColumn.id) ? listColumn.id : 'newColumn';
                const hasEntryId = listColumn.itemsList.includes(entryId);
                if (hasEntryId) {
                    state = state.setIn(
                        ['columnById', columnId, 'itemsList'],
                        listColumn.itemsList.filter(id => id !== entryId)
                    );
                } else {
                    state = state.setIn(
                        ['columnById', columnId, 'itemsList'],
                        listColumn.itemsList.push(entryId)
                    );
                }
            });
        }
        return state;
    },

    // [types.PROFILE_COMMENTS_ITERATOR]: itemIterator,

    // [types.PROFILE_COMMENTS_ITERATOR_ERROR]: itemIteratorError,

    // [types.PROFILE_COMMENTS_ITERATOR_SUCCESS]: (state, { data, request }) => {
    //     if (!request.columnId || !state.getIn(['columnById', request.columnId])) {
    //         return state;
    //     }
    
    //     const commentIds = data.collection.map(comm => comm.commentId);
    //     const moreItems = !!data.lastBlock;
    //     return state.mergeIn(['columnById', request.columnId], {
    //         itemsList: List(commentIds),
    //         firstBlock: request.lastBlock + 1,
    //         flags: state.getIn(['columnById', request.columnId, 'flags']).merge({
    //             fetchingItems: false,
    //             moreItems
    //         }),
    //         lastBlock: data.lastBlock,
    //         lastIndex: data.lastIndex
    //     });
    // },

    // [types.PROFILE_FOLLOWERS_ITERATOR]: itemIterator,

    // [types.PROFILE_FOLLOWERS_ITERATOR_ERROR]: itemIteratorError,

    // [types.PROFILE_FOLLOWERS_ITERATOR_SUCCESS]: profileIteratorSuccess,
    
    // [types.PROFILE_FOLLOWINGS_ITERATOR]: itemIterator,
    
    // [types.PROFILE_FOLLOWINGS_ITERATOR_ERROR]: itemIteratorError,

    // [types.PROFILE_FOLLOWINGS_ITERATOR_SUCCESS]: profileIteratorSuccess,    

    [types.PROFILE_MORE_COMMENTS_ITERATOR]: (state) => state.itemMoreIterator(state),

    [types.PROFILE_MORE_COMMENTS_ITERATOR_ERROR]: (state) => state.itemMoreIteratorError(state),    

    [types.PROFILE_MORE_COMMENTS_ITERATOR_SUCCESS]: (state, { data, request }) => {
        if (!request.columnId || !state.getIn(['columnById', request.columnId])) {
            return state;
        }
        /**
         * In some cases this action is fired as a result of a previous fetch
         * for example: user rapidly refreshes a column...
         * To prevent that, make sure we already have something in itemsList
         */
        if (state.getIn(['columnById', request.columnId, 'itemsList']).size === 0) {
            return state;
        }
    
        const newIds = data.collection.map(comm => comm.commentId);
        const moreItems = !!data.lastBlock;
        return state.mergeIn(['columnById', request.columnId], {
            itemsList: state.getIn(['columnById', request.columnId, 'itemsList']).push(...newIds),
            flags: state.getIn(['columnById', request.columnId, 'flags']).merge({
                fetchingMoreItems: false,
                moreItems
            }),
            lastBlock: data.lastBlock || null,
            lastIndex: data.lastIndex
        });
    },

    [types.PROFILE_MORE_FOLLOWERS_ITERATOR]: (state) => state.itemMoreIterator(state),

    [types.PROFILE_MORE_FOLLOWERS_ITERATOR_ERROR]: (state) => state.itemMoreIteratorError(state),

    [types.PROFILE_MORE_FOLLOWERS_ITERATOR_SUCCESS]: (state) => state.profileMoreIteratorSuccess(state),

    [types.PROFILE_MORE_FOLLOWINGS_ITERATOR]: (state) => state.itemMoreIterator(state),
    
    [types.PROFILE_MORE_FOLLOWINGS_ITERATOR_ERROR]: (state) => state.itemMoreIteratorError(state),

    [types.PROFILE_MORE_FOLLOWINGS_ITERATOR_SUCCESS]: (state) => state.profileMoreIteratorSuccess(state), 

    [types.PROFILE_LOGOUT_SUCCESS]: () => initialState,

    [types.SHOW_PREVIEW]: (state, { columnType, value }) =>
        state.setIn(['columnById', 'previewColumn'], new ColumnRecord({
            id: 'previewColumn',
            type: columnType,
            value
        })),
});

export default dashboardState;
