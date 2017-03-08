import * as types from '../constants';

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

export function ipfsGetPorts () {
    return {
        type: types.IPFS_GET_PORTS
    };
}

export function ipfsGetPortsSuccess (data) {
    return {
        type: types.IPFS_GET_PORTS_SUCCESS,
        data
    };
}

export function ipfsGetPortsError (error) {
    error.code = 'IGPE01';
    return {
        type: types.IPFS_GET_PORTS_ERROR,
        error
    };
}

export function ipfsSetPorts (ports) {
    return {
        type: types.IPFS_SET_PORTS,
        ports
    };
}

export function ipfsSetPortsSuccess (data) {
    return {
        type: types.IPFS_SET_PORTS_SUCCESS,
        data
    };
}

export function ipfsSetPortsError (error) {
    error.code = 'ISPE01';
    return {
        type: types.IPFS_SET_PORTS_ERROR,
        error
    };
}

export function ipfsResetPorts () {
    return {
        type: types.IPFS_RESET_PORTS
    };
}

export function gethResetBusy () {
    return {
        type: types.RESET_GETH_BUSY
    };
}

export function resetIpfsBusy () {
    return {
        type: types.RESET_IPFS_BUSY
    };
}

export function stopGethSuccess (data) {
    return {
        type: types.STOP_GETH_SUCCESS,
        data
    };
}

export function ipfsGetLogsSuccess (data) {
    return {
        type: types.IPFS_GET_LOGS_SUCCESS,
        data
    };
}

export function gethPauseSync () {
    return {
        type: types.GETH_PAUSE_SYNC
    };
}

export function gethResumeSync () {
    return {
        type: types.GETH_RESUME_SYNC
    };
}

export function gethStart () {
    return {
        type: types.GETH_START
    };
}

export function gethStartSuccess (data) {
    return {
        type: types.GETH_START_SUCCESS,
        data
    };
}

export function gethStartError (data, error) {
    return {
        type: types.GETH_START_ERROR,
        data,
        error
    };
}

export function gethStartLogger () {
    return {
        type: types.GETH_START_LOGGER
    };
}

export function gethStopLogger () {
    return {
        type: types.GETH_STOP_LOGGER
    };
}

export function ipfsStartLogger () {
    return {
        type: types.IPFS_START_LOGGER
    };
}

export function ipfsStopLogger () {
    return {
        type: types.IPFS_STOP_LOGGER
    };
}

export function gethStop () {
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

export function gethStopSync () {
    return {
        type: types.GETH_STOP_SYNC
    };
}

export function ipfsStart () {
    return {
        type: types.IPFS_START
    };
}

export function ipfsStartSuccess (data) {
    return {
        type: types.IPFS_START_SUCCESS,
        data
    };
}

export function ipfsStartError (data, error) {
    return {
        type: types.IPFS_START_ERROR,
        data,
        error
    };
}

export function ipfsStop () {
    return {
        type: types.IPFS_STOP
    };
}

export function ipfsStopSuccess (data) {
    return {
        type: types.IPFS_STOP_SUCCESS,
        data
    };
}

export function ipfsStopError (error) {
    error.code = 'ISTE01';
    return {
        type: types.IPFS_STOP_ERROR,
        error
    };
}

export function gethGetStatus () {
    return {
        type: types.GETH_GET_STATUS
    };
}

export function gethGetStatusError (error) {
    return {
        type: types.GETH_GET_STATUS_ERROR,
        error
    };
}

export function gethGetStatusSuccess (data) {
    return {
        type: types.GETH_GET_STATUS_SUCCESS,
        data
    };
}

export function ipfsGetStatus () {
    return {
        type: types.IPFS_GET_STATUS
    };
}

export function ipfsGetStatusError (error) {
    return {
        type: types.IPFS_GET_STATUS_ERROR,
        error
    };
}

export function ipfsGetStatusSuccess (data) {
    return {
        type: types.IPFS_GET_STATUS_SUCCESS,
        data
    };
}

export function gethGetSyncStatus () {
    return {
        type: types.GETH_GET_SYNC_STATUS
    };
}

export function gethGetSyncStatusSuccess (data) {
    return {
        type: types.GETH_GET_SYNC_STATUS_SUCCESS,
        data
    };
}

export function gethGetSyncStatusError (error) {
    return {
        type: types.GETH_GET_SYNC_STATUS_ERROR,
        error
    };
}
