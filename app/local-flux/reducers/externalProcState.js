/* eslint new-cap: [2, {capIsNewExceptions: ["Record"]}] */
import { fromJS, Record, List, Map, Set } from 'immutable';
import { createReducer } from './create-reducer';
import * as types from '../constants/external-process-constants';
import * as settingsTypes from '../constants/SettingsConstants';
import R from 'ramda';

const GethStatus = Record({
    downloading: null,
    starting: null,
    api: false,
    spawned: false,
    started: null,
    stopped: null,
    startRequested: false,
    blockNr: null
});

const GethSyncStatus = Record({
    currentBlock: null,
    highestBlock: null,
    startingBlock: null,
    peerCount: null,
    knownStates: null,
    pulledStates: null,
    synced: false
});

const ErrorRecord = Record({
    code: 0,
    fatal: false,
    message: ''
});

const IpfsStatus = Record({
    downloading: null,
    api: false,
    spawned: false,
    started: null,
    stopped: null,
    startRequested: false
});

const initialState = fromJS({
    gethStatus: new GethStatus(),
    gethSyncStatus: new GethSyncStatus(),
    ipfsStatus: new IpfsStatus(),
    gethErrors: new List(),
    gethLogs: new Set(),
    ipfsErrors: new List(),
    ipfsLogs: new Set(),
    /**
     * syncActionId
     *      0: not started / initial
     *      1: syncing
     *      2: paused
     *      3: stopped
     *      4: finished
     */
    syncActionId: 0,
    /**
     * gethBusyState is used to disable consecutive actions on geth service
     *      false: geth is started/stopped
     *      true: geth is starting/stopping
     */
    gethBusyState: false,
    ipfsBusyState: false,
    ipfsPortsRequested: false
});

function buildLogsSet (logs) {
    const logsSet = new Set(logs)
        .sort((first, second) => {
            const firstTimestamp = new Date(first.timestamp).getTime();
            const secondTimestamp = new Date(second.timestamp).getTime();
            if (firstTimestamp < secondTimestamp) {
                return 1;
            } else if (firstTimestamp > secondTimestamp) {
                return -1;
            }
            return 0;
        });
    return logsSet.map(log => new Map(log)).slice(0, 20);
}

const eProcState = createReducer(initialState, {
    [types.START_GETH]: state =>
        state.merge({
            gethStatus: state.get('gethStatus').merge({ startRequested: true }),
            gethErrors: state.get('gethErrors').clear(),
            gethBusyState: true
        }),

    [types.START_GETH_SUCCESS]: (state, action) => {
        const newStatus = action.data;
        const syncActionId = state.get('syncActionId') === 3 && newStatus.api ?
            1 :
            state.get('syncActionId');

        if (newStatus.starting || newStatus.spawned || newStatus.api) {
            newStatus.downloading = null;
        }
        if (newStatus.started || newStatus.spawned) {
            newStatus.starting = null;
            newStatus.stopped = null;
        }
        return state.merge({
            gethStatus: state.get('gethStatus').merge(newStatus),
            gethErrors: state.get('gethErrors').clear(),
            syncActionId
        });
    },

    [types.START_GETH_ERROR]: (state, action) =>
        state.merge({
            gethErrors: state.get('gethErrors').push(new ErrorRecord(action.error))
        }),

    [types.STOP_GETH]: state =>
        state.merge({
            gethStatus: state.get('gethStatus').merge({ startRequested: false }),
            gethErrors: state.get('gethErrors').clear(),
            gethBusyState: true
        }),

    [types.STOP_GETH_SUCCESS]: (state, action) => {
        const syncActionId = state.get('syncActionId') === 2 ? state.get('syncActionId') : 3;
        return state.merge({
            gethStatus: new GethStatus(action.data),
            syncActionId
        });
    },

    [types.STOP_GETH_ERROR]: (state, action) =>
        state.get('gethErrors').push(new ErrorRecord(action.error)),

    [types.GET_GETH_STATUS_SUCCESS]: (state, action) =>
        state.merge({ gethStatus: state.get('gethStatus').merge(action.data) }),

    [types.GET_IPFS_STATUS_SUCCESS]: (state, action) =>
        state.merge({ ipfsStatus: state.get('ipfsStatus').merge(action.data) }),

    [types.START_IPFS_SUCCESS]: (state, action) => {
        const ipfsStatus = action.data;
        if (ipfsStatus.started || ipfsStatus.spawned) {
            ipfsStatus.downloading = null;
        }
        return state.merge({
            ipfsStatus: new IpfsStatus(action.data),
            ipfsErrors: state.get('ipfsErrors').clear()
        });
    },

    [types.START_IPFS_ERROR]: (state, action) => {
        const ipfsStatus = Object.assign({}, new IpfsStatus().toJS(), action.data);
        return state.merge({
            ipfsErrors: state.get('ipfsErrors').push(new ErrorRecord(action.error)),
            ipfsStatus: state.get('ipfsStatus').merge(ipfsStatus)
        });
    },

    [types.START_IPFS]: state =>
        state.merge({
            ipfsStatus: state.get('ipfsStatus').merge({ startRequested: true }),
            ipfsErrors: state.get('ipfsErrors').clear(),
            ipfsBusyState: true
        }),

    [types.STOP_IPFS]: state =>
        state.merge({
            ipfsStatus: state.get('ipfsStatus').merge({ startRequested: false }),
            ipfsErrors: state.get('ipfsErrors').clear(),
            ipfsBusyState: true
        }),

    [types.STOP_IPFS_SUCCESS]: state =>
        state.merge({
            ipfsStatus: new IpfsStatus(),
            ipfsPortsRequested: false
        }),

    [types.STOP_IPFS_ERROR]: (state, action) =>
        state.merge({
            ipfsErrors: state.get('ipfsErrors').push(new ErrorRecord(action.error)),
            ipfsPortsRequested: false
        }),

    [types.GET_IPFS_STATUS_SUCCESS]: (state, action) =>
        state.merge({ ipfsStatus: new IpfsStatus(action.data) }),

    [types.GET_IPFS_PORTS]: state =>
        state.set('ipfsPortsRequested', true),

    [types.GET_IPFS_PORTS_SUCCESS]: state =>
        state.set('ipfsPortsRequested', false),

    [types.GET_IPFS_PORTS_ERROR]: state =>
        state.set('ipfsPortsRequested', false),

    [types.GET_SYNC_STATUS_SUCCESS]: (state, action) =>
        state.merge({ gethSyncStatus: new GethSyncStatus(action.data) }),

    [types.SYNC_ACTIVE]: state =>
        state.merge({
            syncActionId: 1
        }),

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

