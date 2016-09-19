import * as types from '../../constants/external-process-constants';

export function getGethStatusSuccess (data) {
    return {
        type: types.GET_GETH_STATUS_SUCCESS,
        status: data
    };
}

export function getGethStatusError (error) {
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
    return {
        type: types.STOP_GETH_ERROR,
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
    return {
        type: types.STOP_IPFS_ERROR,
        error
    };
}

export function startSync (data) {
    return {
        type: types.SYNC_ACTIVE,
        data
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
