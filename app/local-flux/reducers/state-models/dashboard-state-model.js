import { List, Map, Record } from 'immutable';
import { differenceWith } from 'ramda';
import * as columnTypes from '../../../constants/columns';
import * as types from '../../constants';


// const Flags = Record({
//     firstDashboardReady: false,
//     renamingDashboard: false
// });

// const ColumnFlags = Record({
//     fetchingItems: false,
//     fetchingMoreItems: false,
//     moreItems: false
// });

export const ColumnRecord = Record({
    id: null,
    itemsList: new List(),
    firstBlock: null,
    firstIndex: 0,
    // flags: new ColumnFlags(),
    newItems: new List(), // a list of newly published entryIds
    large: false,
    lastBlock: null,
    lastIndex: 0,
    type: null,
    value: '',
});

export const DashboardRecord = Record({
    columns: new List(),
    ethAddress: null,
    id: null,
    name: null,
    timestamp: null
});

export const NewColumnRecord = Record({
    suggestions: new List(),
    type: null,
    value: ''
});

export const DashboardState = Record({
    activeDashboard: null,
    allDashboards: new List(),
    byId: new Map(),
    columnById: new Map({
        newColumn: new ColumnRecord(),
        profileComments: new ColumnRecord({
            id: columnTypes.profileComments,
            type: columnTypes.profileComments
        }),
        // profileEntries: new ColumnRecord({ id: profileEntries, type: profileEntries }),
        profileFollowers: new ColumnRecord({
            id: columnTypes.profileFollowers,
            type: columnTypes.profileFollowers
        }),
        profileFollowings: new ColumnRecord({
            id: columnTypes.profileFollowings,
            type: columnTypes.profileFollowings
        }),
    }),
    // flags: new Flags(),
    newColumn: null,
    newDashboard: false,
    search: null,
});

export default class DashboardStateModel extends DashboardState {
    itemIterator (state, { column }) {
        const { id, value, reversed } = column;
        if (reversed || !id) {
            return state;
        }
        if (!state.getIn(['columnById', id])) {
            const newColumn = (new ColumnRecord({ id, value })).setIn(['flags', 'fetchingItems'], true);
            return state.setIn(['columnById', id], newColumn);
        }
        if (id === columnTypes.newColumn) {
            return state.mergeIn(['columnById', id], {
                flags: state.getIn(['columnById', id, 'flags']).set('fetchingItems', true),
                value,
                id
            });
        }
        return state.mergeIn(['columnById', id], {
            flags: state.getIn(['columnById', id, 'flags']).set('fetchingItems', true),
            itemsList: List(),
            value
        });
    }

    itemIteratorError (state, { request }) {
        if (request.reversed || !request.columnId || !state.getIn(['columnById', request.columnId])) {
            return state;
        }
        return state.mergeIn(['columnById', request.columnId, 'flags'], { fetchingItems: false });
    }

    entryIteratorSuccess (state, { data, type, request }) {
        if (!request.columnId || !state.getIn(['columnById', request.columnId])) {
            return state;
        }

        if (request.reversed) {
            const diffFn = (x, y) => x === y;
            const diffArr = differenceWith(
                diffFn,
                data.collection.map(entry => entry.entryId),
                state.getIn(['columnById', request.columnId, 'newItems']).toJS()
            );
            return state.mergeIn(['columnById', request.columnId], {
                newItems: state.getIn(['columnById', request.columnId, 'newItems']).unshift(...diffArr),
                firstBlock: data.lastBlock,
                firstIndex: data.lastIndex,
            });
        }

        const entryIds = data.collection.map(entry => entry.entryId);
        const moreItems = type/* type === types.ENTRY_LIST_ITERATOR_SUCCESS */ ?
            request.limit === data.collection.length :
            !!data.lastBlock;
        return state.mergeIn(['columnById', request.columnId], {
            itemsList: List(entryIds),
            firstBlock: request.toBlock + 1,
            flags: state.getIn(['columnById', request.columnId, 'flags']).merge({
                fetchingItems: false,
                moreItems
            }),
            lastBlock: data.lastBlock,
            lastIndex: data.lastIndex
        });
    }

    profileIteratorSuccess (state, { data, request }) {
        if (!request.columnId || !state.getIn(['columnById', request.columnId])) {
            return state;
        }

        const ethAddresses = data.collection.map(profile => profile.ethAddress);
        return state.mergeIn(['columnById', request.columnId], {
            itemsList: List(ethAddresses),
            flags: state.getIn(['columnById', request.columnId, 'flags']).merge({
                fetchingItems: false,
                moreItems: !!data.lastBlock
            }),
            lastBlock: data.lastBlock,
            lastIndex: data.lastIndex
        });
    }

    itemMoreIterator (state, { column }) {
        const { id } = column;
        if (!id || !state.getIn(['columnById', id])) {
            return state;
        }
        return state.mergeIn(['columnById', id, 'flags'], { fetchingMoreItems: true });
    }

    itemMoreIteratorError (state, { request }) {
        if (!request.columnId || !state.getIn(['columnById', request.columnId])) {
            return state;
        }
        return state.mergeIn(['columnById', request.columnId, 'flags'], { fetchingMoreItems: false });
    }

    entryMoreIteratorSuccess (state, { data, request, type }) {
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
        const column = state.getIn(['columnById', request.columnId]);
        if (request.columnId === columnTypes.profileEntries && column.value &&
            request.ethAddress !== column.value) {
            return state;
        }

        const newIds = data.collection.map(entry => entry.entryId);
        const moreItems = type === types.ENTRY_MORE_LIST_ITERATOR_SUCCESS ?
            request.limit === data.collection.length :
            !!data.lastBlock;
        return state.mergeIn(['columnById', request.columnId], {
            itemsList: state.getIn(['columnById', request.columnId, 'itemsList']).push(...newIds),
            flags: state.getIn(['columnById', request.columnId, 'flags']).merge({
                fetchingMoreItems: false,
                moreItems
            }),
            lastBlock: data.lastBlock || null,
            lastIndex: data.lastIndex
        });
    }

    profileMoreIteratorSuccess (state, { data, request }) {
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

        const newIds = data.collection.map(profile => profile.ethAddress);
        return state.mergeIn(['columnById', request.columnId], {
            itemsList: state.getIn(['columnById', request.columnId, 'itemsList']).push(...newIds),
            flags: state.getIn(['columnById', request.columnId, 'flags']).merge({
                fetchingMoreItems: false,
                moreItems: !!data.lastBlock,
            }),
            lastBlock: data.lastBlock || null,
            lastIndex: data.lastIndex
        });
    }
    createDashboardRecord (data) {
        let dashboard = new DashboardRecord(data);
        dashboard = dashboard.set('columns', List(dashboard.columns.map(col => col.id)));
        return dashboard;
    }
}
