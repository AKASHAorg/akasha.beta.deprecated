import * as types from '../../constants/external-process-constants';

export function getGethStatusSuccess (data) {
    return {
        type: types.GET_GETH_STATUS_SUCCESS,
        data
    };
}

export function getGethStatusError (error) {
    error.code = 'GSE'
    return {
        type: types.GET_GETH_STATUS_ERROR,
        error
    };
}

export function getGethOptionsSuccess (data) {
    return {
        type: types.GET_GETH_OPTIONS_SUCCESS,
        options: data
    };
}

export function getGethOptionsError (error) {
    error.code = 'GGOE';
    return {
        type: types.GET_GETH_OPTIONS_ERROR,
        error
    };
}

export function startGethSuccess (data) {
    return {
        type: types.START_GETH_SUCCESS,
        data
    };
}

export function startGethError (error) {
    error.code = 'SGE01'
    return {
        type: types.START_GETH_ERROR,
        error
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

export function startIPFSSuccess (data) {
    return {
        type: types.START_IPFS_SUCCESS,
        data
    };
}

export function startIPFSError (error) {
    error.code = 'SIE01';
    return {
        type: types.START_IPFS_ERROR,
        error
    };
}

export function configIpfsSuccess (data) {
    return {
        type: types.CONFIG_IPFS_SUCCESS,
        data
    };
}

export function configIpfsError (error) {
    error.code = 'CIE';
    return {
        type: types.CONFIG_IPFS_ERROR,
        error
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
        type: types.SYNC_PAUSE
    };
}

export function resumeSync () {
    return {
        type: types.SYNC_RESUME
    };
}

export function getGethLogs(data) {
    return {
        type: types.GET_GETH_LOGS_SUCCESS,
        data
    };
}