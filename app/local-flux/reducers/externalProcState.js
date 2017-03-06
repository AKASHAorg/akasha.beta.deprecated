/* eslint new-cap: [2, {capIsNewExceptions: ["Record"]}] */
import { fromJS } from 'immutable';
import { createReducer } from './create-reducer';
import * as types from '../constants/external-process-constants';
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
                startRequested: true,
                busyState: true
            }),
        }),

    [types.GETH_START_SUCCESS]: (state, { data }) => {
        const newStatus = state.get('geth').calculateStatus(data);
        const syncActionId = state.get('geth').getSyncActionId(data);
        return state.mergeIn(['geth'], {
            status: state.getIn(['geth', 'status']).merge(newStatus),
            flags: state.getIn(['geth', 'flags']).setIn(['syncActionId'], syncActionId)
        });
    },

    [types.GETH_STOP]: state =>
        state.mergeIn(['geth'], {
            flags: state.getIn(['geth', 'flags']).merge({
                startRequested: false,
                busyState: true
            }),
        }),

    [types.GETH_STOP_SUCCESS]: (state, action) => {
        const syncActionId = state.get('geth').getSyncActionId();
        return state.mergeIn(['geth'], {
            status: state.getIn(['geth', 'status']).merge(action.data),
            flags: state.getIn(['geth', 'flags']).setIn(['syncActionId'], syncActionId)
        });
    },

    [types.GETH_GET_STATUS_SUCCESS]: (state, action) =>
        state.mergeIn(['geth'], {
            status: state.getIn(['geth', 'status']).merge(action.data)
        }),

    [types.IPFS_START]: state =>
        state.mergeIn(['ipfs'], {
            flags: state.getIn(['ipfs', 'flags']).merge({
                startRequested: true,
                busyState: true
            })
        }),

    [types.IPFS_START_SUCCESS]: (state, action) => {
        const ipfsStatus = state.get('ipfs').computeStatus(action.data);
        return state.mergeIn(['ipfs'], {
            status: state.getIn(['ipfs', 'status']).merge(ipfsStatus),
        });
    },

    [types.IPFS_STOP]: state =>
        state.mergeIn(['ipfs'], {
            flags: state.getIn(['ipfs', 'flags']).merge({
                startRequested: false,
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

    [types.IPFS_GET_PORTS_SUCCESS]: state =>
        state.setIn(['ipfs', 'flags', 'portsRequested'], false),

    [types.IPFS_GET_PORTS_ERROR]: state =>
        state.setIn(['ipfs', 'flags', 'portsRequested'], false),

        // </=========== See @ISSUE #253 =========>

    [types.GETH_GET_SYNC_STATUS_SUCCESS]: (state, action) =>
        state.mergeIn(['geth'], {
            status: state.getIn(['geth', 'status']).merge(action.data)
        }),

    [types.GETH_SYNC_ACTIVE]: state =>
        state.getIn(['geth', 'flags']).setIn(['syncActionId'], 1),

    [types.GETH_SYNC_STOPPED]: state =>
        state.mergeIn(['geth'], {
            flags: state.getIn(['geth', 'flags']).merge({
                syncActionId: 3,
            }),
            syncStatus: state.getIn(['geth', 'syncStatus']).merge({
                peerCount: null,
                synced: false
            })
        }),

    [types.GETH_SYNC_PAUSED]: state =>
        state.mergeIn(['geth'], {
            flags: state.getIn(['geth', 'flags']).merge({
                syncActionId: 3,
            }),
            syncStatus: state.getIn(['geth', 'syncStatus']).merge({
                peerCount: null,
                synced: false
            })
        }),

    [types.GETH_SYNC_RESUME]: state =>
        state.mergeIn(['geth'], {
            flags: state.getIn(['geth', 'flags']).merge({
                syncActionId: 1,
            }),
            syncStatus: state.getIn(['geth', 'syncStatus']).merge({
                peerCount: null,
                synced: false
            })
        }),

    [types.GETH_SYNC_FINISHED]: state =>
        state.getIn(['geth', 'flags']).setIn(['syncActionId'], 4),

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
            logs: state.getIn(['geth', 'logs']).union(action.data.map(log => new LogRecord(log)))
        }),
    [types.IPFS_GET_LOGS_SUCCESS]: (state, action) =>
        state.mergeIn(['ipfs'], {
            logs: state.getIn(['ipfs', 'logs']).union(action.data.map(log => new LogRecord(log)))
        }),
});

export default eProcState;

