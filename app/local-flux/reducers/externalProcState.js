import { fromJS, Record } from 'immutable';
import { createReducer } from './create-reducer';
import * as types from '../constants/external-process-constants';

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

const IpfsStatus = Record({
    downloading: null,
    api: false,
    spawned: false,
    started: null,
    stopped: null
});

const initialState = fromJS({
    gethStatus: new GethStatus(),
    gethSyncStatus: new GethSyncStatus(),
    ipfsStatus: new IpfsStatus(),
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
        state.merge({ gethStatus: new GethStatus(action.data.gethState) }),

    [types.GET_GETH_STATUS_SUCCESS]: (state, action) =>
        state.merge({ gethStatus: new GethStatus(action.status) }),

    [types.GET_IPFS_STATUS_SUCCESS]: (state, action) =>
        state.merge({ ipfsStatus: new IpfsStatus(action.data) }),

    [types.SYNC_ACTIVE]: (state, action) =>
        state.merge({
            gethSyncStatus: new GethSyncStatus(action.syncStatus),
            actionId: 1,
        }),

    [types.SYNC_STOPPED]: (state, action) =>
        state.merge({
            actionId: 2
        }),

    [types.SYNC_FINISHED]: (state, action) =>
        state.merge({
            actionId: 3
        }),

});

export default eProcState;

