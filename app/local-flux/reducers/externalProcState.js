/* eslint new-cap: [2, {capIsNewExceptions: ["Record"]}] */
import { Map, Set, fromJS } from 'immutable';
import { createReducer } from './create-reducer';
import * as types from '../constants/external-process-constants';
import * as settingsTypes from '../constants/SettingsConstants';
import { GethModel, IpfsModel } from './models';
import { ErrorRecord } from './records';
import R from 'ramda';

const initialState = fromJS({
    geth: new GethModel(),
    ipfs: new IpfsModel()
});

// function buildLogsSet (logs) {
//     const logsSet = new Set(logs)
//         .sort((first, second) => {
//             const firstTimestamp = new Date(first.timestamp).getTime();
//             const secondTimestamp = new Date(second.timestamp).getTime();
//             if (firstTimestamp < secondTimestamp) {
//                 return 1;
//             } else if (firstTimestamp > secondTimestamp) {
//                 return -1;
//             }
//             return 0;
//         });
//     return logsSet.map(log => new Map(log)).slice(0, 20);
// }

const eProcState = createReducer(initialState, {
    [types.START_GETH]: state =>
        state.mergeIn(['geth'], {
            flags: state.getIn(['geth', 'flags']).merge({
                startRequested: true,
                busyState: true
            }),
        }),

    [types.START_GETH_SUCCESS]: (state, { data }) => {
        const newStatus = state.get('geth').calculateStatus(data);
        const syncActionId = state.get('geth').getSyncActionId(data);
        return state.mergeIn(['geth'], {
            status: state.getIn(['geth', 'status']).merge(newStatus),
            flags: state.getIn(['geth', 'flags']).setIn(['syncActionId'], syncActionId)
        });
    },

    [types.STOP_GETH]: state =>
        state.mergeIn(['geth'], {
            flags: state.getIn(['geth', 'flags']).merge({
                startRequested: false,
                busyState: true
            }),
        }),

    [types.STOP_GETH_SUCCESS]: (state, action) => {
        const syncActionId = state.get('geth').getSyncActionId();
        return state.mergeIn(['geth'], {
            status: state.getIn(['geth', 'status']).merge(action.data),
            flags: state.getIn(['geth', 'flags']).setIn(['syncActionId'], syncActionId)
        });
    },

    [types.GET_GETH_STATUS_SUCCESS]: (state, action) =>
        state.mergeIn(['geth'], {
            status: state.getIn(['geth', 'status']).merge(action.data)
        }),

    [types.START_IPFS]: state =>
        state.mergeIn(['ipfs'], {
            flags: state.getIn(['ipfs', 'flags']).merge({
                startRequested: true,
                busyState: true
            })
        }),

    [types.START_IPFS_SUCCESS]: (state, action) => {
        const ipfsStatus = state.get('ipfs').computeStatus(action.data);
        return state.mergeIn(['ipfs'], {
            status: state.getIn(['ipfs', 'status']).merge(ipfsStatus),
        });
    },


    [types.STOP_IPFS]: state =>
        state.mergeIn(['ipfs'], {
            flags: state.getIn(['ipfs', 'flags']).merge({
                startRequested: false,
                busyState: true
            }),
        }),

    [types.STOP_IPFS_SUCCESS]: state =>
        state.mergeIn(['ipfs'], {
            status: state.getIn(['ipfs', 'status']).clear(),
            flags: state.getIn(['ipfs', 'flags']).setIn(['portsRequested'], false)
        }),

    [types.GET_IPFS_STATUS_SUCCESS]: (state, action) =>
        state.mergeIn(['ipfs'], {
            status: state.getIn(['ipfs', 'status']).merge(action.data)
        }),

        // ============> no tests for

    [types.GET_IPFS_PORTS]: state =>
        state.setIn(['ipfs', 'flags', 'portsRequested'], true),

    [types.GET_IPFS_PORTS_SUCCESS]: state =>
        state.setIn(['ipfs', 'flags', 'portsRequested'], false),

    [types.GET_IPFS_PORTS_ERROR]: state =>
        state.setIn(['ipfs', 'flags', 'portsRequested'], false),

    [types.GET_SYNC_STATUS_SUCCESS]: (state, action) =>
        state.mergeIn(['geth'], {
            status: state.getIn(['geth', 'status']).merge(action.data)
        }),

    [types.SYNC_ACTIVE]: state =>
        state.getIn(['geth', 'flags']).setIn(['syncActionId'], 1),


        // ===========> refactor below
    [types.SYNC_STOPPED]: state =>
        state.merge({
            syncActionId: 3,
            gethSyncStatus: state.get('gethSyncStatus').merge({
                peerCount: null,
                synced: false
            })
        }),

    [types.SYNC_PAUSED]: state =>
        state.merge({
            syncActionId: 2,
            gethSyncStatus: state.get('gethSyncStatus').merge({
                peerCount: null,
                synced: false
            })
        }),

    [types.SYNC_RESUME]: state =>
        state.merge({
            syncActionId: 1,
            gethSyncStatus: state.get('gethSyncStatus').merge({
                peerCount: null,
                synced: false
            })
        }),

    [types.SYNC_FINISHED]: state =>
        state.merge({
            syncActionId: 4
        }),

    [types.RESET_GETH_BUSY]: state =>
        state.merge({
            gethBusyState: false
        }),

    [types.RESET_IPFS_BUSY]: state =>
        state.merge({
            ipfsBusyState: false
        }),

    [types.SYNC_FINISHED]: state =>
        state.merge({
            syncActionId: 4
        }),

    [types.GET_GETH_LOGS_SUCCESS]: (state, action) => {
        if (!R.symmetricDifference(action.data, state.get('gethLogs').toJS()).length) {
            return state;
        }
        const logs = [...action.data, ...state.get('gethLogs').toJS()];
        const logsSet = buildLogsSet(logs);
        return state.set('gethLogs', logsSet);
    },

    [types.GET_IPFS_LOGS_SUCCESS]: (state, action) => {
        if (!R.symmetricDifference(action.data, state.get('ipfsLogs').toJS()).length) {
            return state;
        }
        const logs = [...action.data, ...state.get('ipfsLogs').toJS()];
        const logsSet = buildLogsSet(logs);
        return state.set('ipfsLogs', logsSet);
    },

    [settingsTypes.SAVE_SETTINGS]: (state, action) => {
        if (action.table === 'geth') {
            return state.merge({
                gethBusyState: true
            });
        }
        return state;
    },

    [settingsTypes.SAVE_SETTINGS_SUCCESS]: (state, action) => {
        if (action.table === 'geth') {
            return state.merge({
                gethBusyState: false
            });
        }
        return state;
    },

    [settingsTypes.SAVE_SETTINGS_ERROR]: (state, action) => {
        if (action.table === 'geth') {
            return state.merge({
                gethBusyState: false
            });
        }
        return state;
    }
});

export default eProcState;

