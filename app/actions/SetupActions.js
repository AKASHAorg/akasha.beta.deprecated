import { startGethService, stopGethService, startIPFSService } from '../services/setup-service';
import { hashHistory } from 'react-router';
import { saveSettings } from './SettingsActions';
import * as types from '../constants/SetupConstants';

export function nextStep (pathName) {
    return hashHistory.push(pathName);
}
export function toggleAdvancedSettings (isAdvanced) {
    return dispatch => dispatch({ type: types.SETUP_ADVANCED_SETTINGS, isAdvanced });
}
export function setupGethDataDir (path) {
    return dispatch => dispatch({ type: types.SETUP_GETH_DATADIR, path });
}
export function setupGethIPCPath (path) {
    return dispatch => dispatch({ type: types.SETUP_GETH_IPCPATH, path });
}
export function setupGethCacheSize (size) {
    return dispatch => dispatch({ type: types.SETUP_GETH_CACHE_SIZE, size });
}
export function setupIPFSApiPort (port) {
    return dispatch => dispatch({ type: types.SETUP_IPFS_API_PORT, port });
}
export function setupIPFSGatewayPort (port) {
    return dispatch => dispatch({ type: types.SETUP_IPFS_GATEWAY_PORT, port });
}
// start / stop geth
function startGethSuccess (data) {
    saveSettings('geth', data);
    nextStep('sync-status');
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
    return dispatch => startGethService(options).then((data) => {
        if (!data.success) {
            return dispatch(startGethError({ data, options }));
        }
        return dispatch(startGethSuccess(data));
    }).catch(err => dispatch(startGethError({ err })));
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

export function retrySetup (isAdvanced) {
    return dispatch => dispatch({ type: types.RETRY_SETUP, isAdvanced });
}
