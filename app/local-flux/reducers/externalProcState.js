/* eslint new-cap: [2, {capIsNewExceptions: ["Record"]}] */
import { createReducer } from './utils';
import * as types from '../constants';
import ExternalProcessStateModel, {
    GethSyncStatus,
    LogRecord
} from './state-models/external-process-state-model';
import { GETH_MODULE, IPFS_MODULE } from '@akashaproject/common/constants';

const initialState = new ExternalProcessStateModel();

const eProcState = createReducer(initialState, {
    [types.CLEAR_SYNC_STATUS]: state => state.setIn(['geth', 'syncStatus'], new GethSyncStatus()),

    [`${GETH_MODULE.start}_SUCCESS`]: (state, { payload }) => {
        const { data, services } = payload;
        const gethStatus = state.getIn(['geth', 'status']);
        // if geth was stopped and it is not upgrading, ignore this action
        if (gethStatus.get('stopped') && !gethStatus.get('upgrading') && !data.starting) {
            return state;
        }
        // const syncActionId = state.getIn(['geth', 'syncActionId']) === 4 ? 4 : 1;
        const status = Object.assign({}, data, services.geth);
        const newStatus = state.computeGethStatus(status);
        return state.mergeIn(['geth'], {
            // flags: state.getIn(['geth', 'flags']).merge({
            //     gethStarting: false
            // }),
            status: state.getIn(['geth', 'status']).merge(newStatus),
            // syncActionId,
            syncStatus: new GethSyncStatus()
        });
    },

    [`${GETH_MODULE.stop}_SUCCESS`]: (state, { payload }) => {
        const { data, services } = payload;
        if (state.getIn(['geth', 'status', 'upgrading'])) {
            return state;
        }
        // const oldSyncActionId = state.getIn(['geth', 'syncActionId']);
        // const syncActionId = oldSyncActionId === 2 ? oldSyncActionId : 3;
        // action.data.upgrading = state.getIn(['geth', 'status', 'upgrading']) || null;
        const status = Object.assign({}, data, services.geth);
        const newStatus = state.computeGethStatus(status);

        return state.mergeIn(['geth'], {
            status: state.getIn(['geth', 'status']).merge(newStatus)
            // syncActionId
        });
    },

    [`${GETH_MODULE.gethStatus}_SUCCESS`]: (state, { payload }) => {
        const { data, services } = payload;
        state.mergeIn(['geth'], {
            flags: state.getIn(['geth', 'flags']).set('statusFetched', true),
            status: state.getIn(['geth', 'status']).merge(Object.assign({}, data, services.geth))
        });
    },

    [`${IPFS_MODULE.start}_ERROR`]: (state, { payload }) => {
        const ipfsStatus = state.computeIpfsStatus(payload);
        return state.mergeIn(['ipfs'], {
            status: state.getIn(['ipfs', 'status']).merge(ipfsStatus)
        });
    },

    [`${IPFS_MODULE.start}_SUCCESS`]: (state, { payload }) => {
        const { data, services } = payload;
        const status = Object.assign({}, data, services.ipfs);
        const ipfsStatus = state.computeIpfsStatus(status);
        return state.mergeIn(['ipfs'], {
            status: state.getIn(['ipfs', 'status']).merge(ipfsStatus)
        });
    },

    [`${IPFS_MODULE.stop}_SUCCESS`]: (state, { payload }) => {
        const { data, services } = payload;
        const status = Object.assign({}, data, services.ipfs);
        let newStatus;
        if (state.getIn(['ipfs', 'status', 'upgrading'])) {
            newStatus = state.getIn(['ipfs', 'status']);
        } else {
            newStatus = state
                .getIn(['ipfs', 'status'])
                .clear()
                .merge(status);
        }
        return state.mergeIn(['ipfs'], {
            status: newStatus
        });
    },

    [`${IPFS_MODULE.ipfsStatus}_SUCCESS`]: (state, { payload }) => {
        const { data, services } = payload;
        state.mergeIn(['ipfs'], {
            status: state.getIn(['ipfs', 'status']).merge(Object.assign({}, data, services.ipfs))
        });
    },

    [`${IPFS_MODULE.getPorts}_SUCCESS`]: (state, { payload }) =>
        state.mergeIn(['ipfs'], {
            flags: state.getIn(['ipfs', 'flags']).setIn(['portsRequested'], false),
            status: state.getIn(['ipfs', 'status']).merge({
                api: payload.services.ipfs.api,
                baseUrl: payload.services.ipfs.baseUrl,
                process: payload.services.ipfs.process
            })
        }),

    [`${GETH_MODULE.syncStatus}_SUCCESS`]: (state, { payload }) =>
        // const oldSyncActionId = state.getIn(['geth', 'syncActionId']);
        // let syncActionId = oldSyncActionId;
        // if (data.synced) {
        //     syncActionId = 4;
        // } else if (!oldSyncActionId) {
        //     syncActionId = 1;
        // }
        state.mergeIn(['geth'], {
            status: state.getIn(['geth', 'status']).merge(payload.geth),
            // syncActionId,
            syncStatus: state.getIn(['geth', 'syncStatus']).merge(payload)
        }),

    [`${GETH_MODULE.logs}_SUCCESS`]: (state, { payload }) => {
        if (!payload.length) {
            return state;
        }
        const timestamp = new Date(payload[payload.length - 1].timestamp).getTime();
        return state.mergeIn(['geth'], {
            lastLogTimestamp: timestamp,
            logs: state
                .getIn(['geth', 'logs'])
                .union(payload.map(log => new LogRecord(log)))
                .takeLast(20)
        });
    },

    [`${IPFS_MODULE.logs}_SUCCESS`]: (state, { payload }) => {
        if (!payload.length) {
            return state;
        }
        const timestamp = new Date(payload[payload.length - 1].timestamp).getTime();
        return state.mergeIn(['ipfs'], {
            lastLogTimestamp: timestamp,
            logs: state
                .getIn(['ipfs', 'logs'])
                .union(payload.map(log => new LogRecord(log)))
                .takeLast(20)
        });
    },

    [types.SERVICES_SET_TIMESTAMP]: (state, { payload }) =>
        state.merge({
            geth: state.get('geth').set('lastLogTimestamp', payload.timestamp),
            ipfs: state.get('ipfs').set('lastLogTimestamp', payload.timestamp)
        })
});

export default eProcState;
