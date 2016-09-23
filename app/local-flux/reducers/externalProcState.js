import { fromJS, Record, List } from 'immutable';
import { createReducer } from './create-reducer';
import * as types from '../constants/external-process-constants';

/* eslint new-cap: [2, {capIsNewExceptions: ["Record"]}] */
const GethStatus = Record({
    downloading: null,
    starting: null,
    api: false,
    spawned: false,
    started: null,
    stopped: null
});

const GethSyncStatus = Record({
    currentBlock: null,
    highestBlock: null,
    startingBlock: null,
    peerCount: null,
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
    error: null
});

const initialState = fromJS({
    gethStatus: new GethStatus(),
    gethSyncStatus: new GethSyncStatus(),
    ipfsStatus: new IpfsStatus(),
    gethErrors: new List(),
    ipfsErrors: new List(),
    /**
     * syncActionId
     *      0: not started / initial
     *      1: syncing
     *      2: stopped
     *      3: finished
     */
    syncActionId: 0
});

const eProcState = createReducer(initialState, {
    [types.START_GETH_SUCCESS]: (state, action) =>
        state.merge({ gethStatus: state.get('gethStatus').merge(action.data) }),

    [types.START_GETH_ERROR]: (state, action) =>
        state.merge({
            gethErrors: state.get('gethErrors').push(new ErrorRecord(action.error))
        }),

    [types.GET_GETH_STATUS_SUCCESS]: (state, action) =>
        state.merge({ gethStatus: new GethStatus(action.status) }),

    [types.GET_IPFS_STATUS_SUCCESS]: (state, action) =>
        state.merge({ ipfsStatus: new IpfsStatus(action.data) }),

    [types.GET_SYNC_STATUS_SUCCESS]: (state, action) =>
        state.merge({ gethSyncStatus: new GethSyncStatus(action.data) }),

    [types.SYNC_ACTIVE]: state =>
        state.merge({
            actionId: 1,
        }),

    [types.SYNC_STOPPED]: state =>
        state.merge({
            actionId: 2
        }),

    [types.SYNC_FINISHED]: state =>
        state.merge({
            actionId: 3
        }),

});

export default eProcState;

