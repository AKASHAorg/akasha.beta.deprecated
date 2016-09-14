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
const IpfsStatus = Record({
    downloading: null,
    api: false,
    spawned: false,
    started: null,
    stopped: null
});
const initialState = fromJS({
    gethStatus: new GethStatus(),
    ipfsStatus: new IpfsStatus()
});

const eProcState = createReducer(initialState, {
    [types.GET_GETH_STATUS_SUCCESS]: (state, action) =>
        state.merge({ gethStatus: new GethStatus(action.gethState) }),

    [types.GET_IPFS_STATUS_SUCCESS]: (state, action) =>
        state.merge({ ipfsStatus: new IpfsStatus(action.ipfsState) }),

});

export default eProcState;

