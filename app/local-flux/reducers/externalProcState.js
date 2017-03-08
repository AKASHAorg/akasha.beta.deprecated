/* eslint new-cap: [2, {capIsNewExceptions: ["Record"]}] */
import { fromJS } from 'immutable';
import { createReducer } from './create-reducer';
import * as types from '../constants';
import { GethModel, IpfsModel } from './models';
import { LogRecord } from './records';

const initialState = fromJS({
    geth: new GethModel(),
    ipfs: new IpfsModel()
});

const eProcState = createReducer(initialState, {
    [types.GETH_START]: state =>
        state.mergeIn(['geth'], {
            flags: state.getIn(['geth', 'flags']).merge({
                busyState: true,
                gethStarting: true,
            }),
        }),

    [types.GETH_START_SUCCESS]: (state, { data }) => {
        const syncActionId = state.getIn(['geth', 'syncActionId']) === 4 ? 4 : 1;
        const newStatus = GethModel.computeStatus(data);
        return state.mergeIn(['geth'], {
            flags: state.getIn(['geth', 'flags']).merge({
                gethStarting: false,
            }),
            status: state.getIn(['geth', 'status']).merge(newStatus),
            syncActionId
        });
    },

    [types.GETH_START_ERROR]: (state, { data }) => {
        const newStatus = GethModel.computeStatus(data);
        return state.mergeIn(['geth'], {
            flags: state.getIn(['geth', 'flags']).merge({
                gethStarting: false,
            }),
            status: state.getIn(['geth', 'status']).merge(newStatus),
        });
    },

    [types.GETH_STOP]: state =>
        state.mergeIn(['geth'], {
            flags: state.getIn(['geth', 'flags']).merge({
                busyState: true
            }),
        }),

    [types.GETH_STOP_SUCCESS]: (state, action) => {
        const oldSyncActionId = state.getIn(['geth', 'syncActionId']);
        const syncActionId = oldSyncActionId === 2 ? oldSyncActionId : 3;
        action.data.upgrading = state.getIn(['geth', 'status', 'upgrading']) || null;
        action.data.starting = false;
        return state.mergeIn(['geth'], {
            status: state.getIn(['geth', 'status']).merge(action.data),
            syncActionId
        });
    },

    [types.GETH_GET_STATUS_SUCCESS]: (state, action) =>
        state.mergeIn(['geth'], {
            status: state.getIn(['geth', 'status']).merge(action.data)
        }),

    [types.IPFS_START]: state =>
        state.mergeIn(['ipfs'], {
            flags: state.getIn(['ipfs', 'flags']).merge({
                busyState: true,
                ipfsStarting: true
            })
        }),

    [types.IPFS_START_SUCCESS]: (state, action) => {
        const ipfsStatus = IpfsModel.computeStatus(action.data);
        return state.mergeIn(['ipfs'], {
            flags: state.getIn(['ipfs', 'flags']).merge({
                ipfsStarting: false,
            }),
            status: state.getIn(['ipfs', 'status']).merge(ipfsStatus),
        });
    },

    [types.IPFS_START_ERROR]: (state, action) => {
        const ipfsStatus = IpfsModel.computeStatus(action.data);
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

    [types.IPFS_STOP_SUCCESS]: state =>
        state.mergeIn(['ipfs'], {
            status: state.getIn(['ipfs', 'status']).clear(),
            flags: state.getIn(['ipfs', 'flags']).setIn(['portsRequested'], false)
        }),

    [types.IPFS_GET_STATUS_SUCCESS]: (state, action) =>
        state.mergeIn(['ipfs'], {
            status: state.getIn(['ipfs', 'status']).merge(action.data)
        }),

        // <=========== See @ISSUE #253 =========>

    [types.IPFS_GET_PORTS]: state =>
        state.setIn(['ipfs', 'flags', 'portsRequested'], true),

    [types.IPFS_GET_PORTS_SUCCESS]: (state, { data }) =>
        state.mergeIn(['ipfs'], {
            flags: state.getIn(['ipfs', 'flags']).setIn(['portsRequested'], false),
            status: state.getIn(['ipfs', 'status']).merge({ api: data.api, spawned: data.spawned })
        }),

    [types.IPFS_GET_PORTS_ERROR]: state =>
        state.setIn(['ipfs', 'flags', 'portsRequested'], false),

        // </=========== See @ISSUE #253 =========>

    [types.GETH_GET_SYNC_STATUS_SUCCESS]: (state, action) => {
        const syncActionId = action.data.synced ? 4 : state.getIn(['geth', 'syncActionId']);
        return state.mergeIn(['geth'], {
            syncActionId,
            syncStatus: state.getIn(['geth', 'syncStatus']).merge(action.data),
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

    [types.GETH_GET_LOGS_SUCCESS]: (state, action) =>
        state.mergeIn(['geth'], {
            logs: state.getIn(['geth', 'logs'])
                .union(action.data.map(log => new LogRecord(log)))
                .takeLast(20)
        }),

    [types.IPFS_GET_LOGS_SUCCESS]: (state, action) =>
        state.mergeIn(['ipfs'], {
            logs: state.getIn(['ipfs', 'logs'])
                .union(action.data.map(log => new LogRecord(log)))
                .takeLast(20)
        }),

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

});

export default eProcState;

