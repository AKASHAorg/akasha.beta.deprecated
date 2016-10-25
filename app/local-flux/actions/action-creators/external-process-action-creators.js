import * as types from '../../constants/external-process-constants';

export function getGethStatusSuccess (data) {
    return {
        type: types.GET_GETH_STATUS_SUCCESS,
        data
    };
}

export function getGethStatusError (error) {
    error.code = 'GSE';
    return {
        type: types.GET_GETH_STATUS_ERROR,
        error
    };
}

export function getGethOptionsSuccess (data) {
    return {
        type: types.GET_GETH_OPTIONS_SUCCESS,
        data
    };
}

export function getGethOptionsError (error) {
    error.code = 'GGOE';
    return {
        type: types.GET_GETH_OPTIONS_ERROR,
        error
    };
}

export function startGeth () {
    return {
        type: types.START_GETH
    };
}

export function startGethSuccess (data) {
    return {
        type: types.START_GETH_SUCCESS,
        data
    };
}

export function startGethError (error) {
    error.code = 'SGE01';
    return {
        type: types.START_GETH_ERROR,
        error
    };
}

export function stopGeth () {
    return {
        type: types.STOP_GETH
    };
}

export function stopGethSuccess (data) {
    return {
        type: types.STOP_GETH_SUCCESS,
        data
    };
}

export function stopGethError (error) {
    error.code = 'SGE02';
    return {
        type: types.STOP_GETH_ERROR,
        error
    };
}

export function getSyncStatusSuccess (data) {
    return {
        type: types.GET_SYNC_STATUS_SUCCESS,
        data
    };
}

export function getSyncStatusError (error) {
    error.code = 'GSSE';
    return {
        type: types.GET_SYNC_STATUS_ERROR,
        error
    };
}

export function getIpfsStatusSuccess (data) {
    return {
        type: types.GET_IPFS_STATUS_SUCCESS,
        data
    };
}

export function getIpfsStatusError (error) {
    error.code = 'ISE';
    return {
        type: types.GET_IPFS_STATUS_ERROR,
        error
    };
}

export function startIPFS () {
    return {
        type: types.START_IPFS
    };
}

export function stopIPFS () {
    return {
        type: types.STOP_IPFS
    };
}

export function startIPFSSuccess (data) {
    return {
        type: types.START_IPFS_SUCCESS,
        data
    };
}

export function startIPFSError (error, data) {
    error.code = 'SIE01';
    if (!error.message || error.message === '') {
        error.message = 'Cannot start IPFS service. Application restart may require.'
    }
    return {
        type: types.START_IPFS_ERROR,
        error,
        data
    };
}

export function getIpfsConfigSuccess (data) {
    return {
        type: types.GET_IPFS_CONFIG_SUCCESS,
        data
    };
}

export function getIpfsConfigError (error) {
    error.code = 'CIE';
    return {
        type: types.GET_IPFS_CONFIG_ERROR,
        error
    };
}

export function getIpfsPorts () {
    return {
        type: types.GET_IPFS_PORTS
    };
}

export function getIpfsPortsSuccess (data) {
    return {
        type: types.GET_IPFS_PORTS_SUCCESS,
        data
    };
}

export function getIpfsPortsError (error) {
    error.code = 'PIE';
    return {
        type: types.GET_IPFS_PORTS_ERROR,
        error
    };
}

export function resetIpfsPorts () {
    return {
        type: types.RESET_IPFS_PORTS
    };
}

export function stopIPFSSuccess (data) {
    return {
        type: types.STOP_IPFS_SUCCESS,
        data
    };
}

export function stopIPFSError (error) {
    error.code = 'SIE02';
    return {
        type: types.STOP_IPFS_ERROR,
        error
    };
}

export function startSync () {
    return {
        type: types.SYNC_ACTIVE
    };
}

export function stopSync () {
    return {
        type: types.SYNC_STOPPED
    };
}

export function pauseSync () {
    return {
        type: types.SYNC_PAUSED
    };
}

export function resumeSync () {
    return {
        type: types.SYNC_RESUME
    };
}

export function finishSync () {
    return {
        type: types.SYNC_FINISHED
    };
}

export function resetGethBusy () {
    return {
        type: types.RESET_GETH_BUSY
    };
}

export function resetIpfsBusy () {
    return {
        type: types.RESET_IPFS_BUSY
    };
}

export function getGethLogs (data) {
    return {
        type: types.GET_GETH_LOGS_SUCCESS,
        data
    };
}
