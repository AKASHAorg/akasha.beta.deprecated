/* eslint new-cap: [2, {capIsNewExceptions: ["Record"]}] */
import { fromJS } from 'immutable';
import { createReducer } from './create-reducer';
import * as types from '../constants';
import { GethRecord, GethSyncStatus, IpfsRecord, LogRecord } from './records';

const initialState = fromJS({
    geth: new GethRecord(),
    ipfs: new IpfsRecord()
});

const computeGethStatus = (status) => {
    const newStatus = Object.assign({}, status);
    if (newStatus.started) {
        newStatus.message = null;
        newStatus.starting = null;
    }
    if (newStatus.starting || newStatus.process || newStatus.api) {
        newStatus.downloading = null;
        newStatus.stopped = null;
    }
    if (newStatus.downloading) {
        newStatus.upgrading = null;
    }
    if (newStatus.stopped) {
        newStatus.starting = false;
        newStatus.started = false;
    }
    return newStatus;
};

const computeIpfsStatus = (newStatus) => {
    if (newStatus.started || newStatus.process) {
        newStatus.downloading = null;
        newStatus.starting = false;
    }
    if (newStatus.downloading) {
        newStatus.upgrading = null;
    }
    return newStatus;
};

const eProcState = createReducer(initialState, {
    [types.CLEAR_SYNC_STATUS]: state =>
        state.setIn(['geth', 'syncStatus'], new GethSyncStatus()),

    [types.GETH_START]: state =>
        state.mergeIn(['geth'], {
            flags: state.getIn(['geth', 'flags']).merge({
                busyState: true,
                gethStarting: true,
            }),
            status: state.getIn(['geth', 'status']).merge({
                stopped: false
            })
        }),

    [types.GETH_START_SUCCESS]: (state, { data, services }) => {
        const gethStatus = state.getIn(['geth', 'status']);
        // if geth was stopped and it is not upgrading, ignore this action
        if (gethStatus.get('stopped') && !gethStatus.get('upgrading') && !data.starting) {
            return state;
        }
        const syncActionId = state.getIn(['geth', 'syncActionId']) === 4 ? 4 : 1;
        const status = Object.assign({}, data, services.geth);
        const newStatus = computeGethStatus(status);
        return state.mergeIn(['geth'], {
            flags: state.getIn(['geth', 'flags']).merge({
                gethStarting: false,
            }),
            status: state.getIn(['geth', 'status']).merge(newStatus),
            syncActionId,
            syncStatus: new GethSyncStatus()
        });
    },

    [types.GETH_START_ERROR]: state =>
        state.setIn(['geth', 'flags', 'gethStarting'], false),

    [types.GETH_STOP]: state =>
        state.setIn(['geth', 'flags', 'busyState'], true),

    [types.GETH_STOP_SUCCESS]: (state, { data, services }) => {
        if (state.getIn(['geth', 'status', 'upgrading'])) {
            return state;
        }
        const oldSyncActionId = state.getIn(['geth', 'syncActionId']);
        const syncActionId = oldSyncActionId === 2 ? oldSyncActionId : 3;
        // action.data.upgrading = state.getIn(['geth', 'status', 'upgrading']) || null;
        const status = Object.assign({}, data, services.geth);
        const newStatus = computeGethStatus(status);

        return state.mergeIn(['geth'], {
            status: state.getIn(['geth', 'status']).merge(newStatus),
            syncActionId
        });
    },

    [types.GETH_GET_STATUS_SUCCESS]: (state, { data, services }) =>
        state.setIn(
            ['geth', 'status'],
            state.getIn(['geth', 'status']).merge(Object.assign({}, data, services.geth)),
        ),

    [types.IPFS_START]: state =>
        state.mergeIn(['ipfs'], {
            flags: state.getIn(['ipfs', 'flags']).merge({
                busyState: true,
                ipfsStarting: true
            })
        }),

    [types.IPFS_START_ERROR]: (state, action) => {
        const ipfsStatus = computeIpfsStatus(action.data);
        return state.mergeIn(['ipfs'], {
            flags: state.getIn(['ipfs', 'flags']).merge({
                ipfsStarting: false,
            }),
            status: state.getIn(['ipfs', 'status']).merge(ipfsStatus),
        });
    },

    [types.IPFS_START_SUCCESS]: (state, { data, services }) => {
        const status = Object.assign({}, data, services.ipfs);
        const ipfsStatus = computeIpfsStatus(status);
        return state.mergeIn(['ipfs'], {
            flags: state.getIn(['ipfs', 'flags']).merge({
                ipfsStarting: false,
            }),
            status: state.getIn(['ipfs', 'status']).merge(ipfsStatus),
        });
    },

    [types.IPFS_STOP]: state =>
        state.mergeIn(['ipfs'], {
            flags: state.getIn(['ipfs', 'flags']).merge({
                busyState: true
            }),
        }),

    [types.IPFS_STOP_SUCCESS]: (state, { data, services }) => {
        const status = Object.assign({}, data, services.ipfs);
        let newStatus;
        if (state.getIn(['ipfs', 'status', 'upgrading'])) {
            newStatus = state.getIn(['ipfs', 'status']);
        } else {
            newStatus = state.getIn(['ipfs', 'status']).clear().merge(status);
        }
        return state.mergeIn(['ipfs'], {
            status: newStatus,
            flags: state.getIn(['ipfs', 'flags']).setIn(['portsRequested'], false)
        });
    },

    [types.IPFS_GET_STATUS_SUCCESS]: (state, { data, services }) =>
        state.mergeIn(['ipfs'], {
            status: state.getIn(['ipfs', 'status']).merge(Object.assign({}, data, services.ipfs))
        }),

    [types.IPFS_GET_PORTS]: state =>
        state.setIn(['ipfs', 'flags', 'portsRequested'], true),

    [types.IPFS_GET_PORTS_SUCCESS]: (state, { services }) =>
        state.mergeIn(['ipfs'], {
            flags: state.getIn(['ipfs', 'flags']).setIn(['portsRequested'], false),
            status: state.getIn(['ipfs', 'status']).merge({
                api: services.ipfs.api,
                process: services.ipfs.process
            })
        }),

    [types.IPFS_GET_PORTS_ERROR]: state =>
        state.setIn(['ipfs', 'flags', 'portsRequested'], false),

    [types.GETH_GET_SYNC_STATUS_SUCCESS]: (state, { data, services }) => {
        const syncActionId = data.synced ? 4 : state.getIn(['geth', 'syncActionId']);
        return state.mergeIn(['geth'], {
            status: state.getIn(['geth', 'status']).merge(services.geth),
            syncActionId,
            syncStatus: state.getIn(['geth', 'syncStatus']).merge(data),
        });
    },

    [types.GETH_STOP_SYNC]: state =>
        state.mergeIn(['geth'], {
            syncActionId: 3,
        }),

    [types.GETH_PAUSE_SYNC]: state =>
        state.mergeIn(['geth'], {
            syncActionId: 2,
        }),

    [types.GETH_RESUME_SYNC]: state =>
        state.mergeIn(['geth'], {
            syncActionId: 1
        }),

    [types.GETH_RESET_BUSY]: state =>
        state.mergeIn(['geth'], {
            flags: state.getIn(['geth', 'flags']).merge({
                busyState: false
            })
        }),

    [types.IPFS_RESET_BUSY]: state =>
        state.mergeIn(['ipfs', 'flags'], {
            busyState: false
        }),

    [types.GETH_GET_LOGS_SUCCESS]: (state, { data }) => {
        if (!data.length) {
            return state;
        }
        const timestamp = new Date(data[data.length - 1].timestamp).getTime();
        return state.mergeIn(['geth'], {
            lastLogTimestamp: timestamp,
            logs: state.getIn(['geth', 'logs'])
                .union(data.map(log => new LogRecord(log)))
                .takeLast(20)
        });
    },

    [types.IPFS_GET_LOGS_SUCCESS]: (state, { data }) => {
        if (!data.length) {
            return state;
        }
        const timestamp = new Date(data[data.length - 1].timestamp).getTime();
        return state.mergeIn(['ipfs'], {
            lastLogTimestamp: timestamp,
            logs: state.getIn(['ipfs', 'logs'])
                .union(data.map(log => new LogRecord(log)))
                .takeLast(20)
        });
    },

    [types.IPFS_SET_PORTS]: state =>
        state.mergeIn(['ipfs', 'flags'], {
            settingPorts: true
        }),

    [types.IPFS_SET_PORTS_SUCCESS]: state =>
        state.mergeIn(['ipfs', 'flags'], {
            settingPorts: false
        }),

    [types.IPFS_SET_PORTS_ERROR]: state =>
        state.mergeIn(['ipfs', 'flags'], {
            settingPorts: false
        }),

    [types.SERVICES_SET_TIMESTAMP]: (state, { timestamp }) =>
        state.merge({
            geth: state.get('geth').set('lastLogTimestamp', timestamp),
            ipfs: state.get('ipfs').set('lastLogTimestamp', timestamp)
        }),

});

export default eProcState;

