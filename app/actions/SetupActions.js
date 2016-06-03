import { startGethService, stopGethService, startIPFSService } from '../services/setup-service';
import * as types from '../constants/SetupConstants';

// start / stop geth
function startGethSuccess (data) {
    return { type: types.START_GETH_SUCCESS, data };
}

function stopGethSuccess (data) {
    return { type: types.STOP_GETH_SUCCESS, data };
}

function startGethError (data) {
    return { type: types.START_GETH_ERROR, data };
}

function stopGethError (data) {
    return { type: types.STOP_GETH_ERROR, data };
}
// start/stop ipfs
function startIPFSSuccess (data) {
    return { type: types.START_IPFS_SUCCESS, data };
}
function stopIPFSSuccess (data) {
    return { type: types.STOP_IPFS_SUCCESS, data };
}
function startIPFSError (data) {
    return { type: types.START_IPFS_ERROR, data };
}
function stopIPFSError (data) {
    return { type: types.STOP_IPFS_ERROR, data };
}

export function startGeth (options) {
    return dispatch => {
        startGethService(options).then(data => {
            if (!data.success) {
                return dispatch(startGethError(data));
            }
            return dispatch(startGethSuccess(data));
        }).catch(reason => {
            dispatch(startGethError(reason));
        });
    };
}
export function stopGeth () {
    return dispatch => {
        stopGethService().then(data => {
            if (!data.success) {
                return dispatch(stopGethError(data));
            }
            return dispatch(stopGethSuccess(data));
        }).catch(reason => {
            dispatch(stopGethError(reason));
        });
    };
}

export function startIPFS (options) {
    return dispatch => {
        startIPFSService(options).then(data => {
            if (!data.success) {
                return dispatch(startIPFSError(data));
            }
            return dispatch(startIPFSSuccess(data));
        }).catch(reason => dispatch(startIPFSError(reason)));
    };
}

export function stopIPFS () {
    return dispatch => {
        stopIPFS().then((data) => {
            if (!data.success) {
                return dispatch(stopIPFSError(data));
            }
            return dispatch(stopIPFSSuccess(data));
        }).catch(reason => dispatch(stopIPFSError(reason)));
    };
}
