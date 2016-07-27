import * as types from '../../constants/external-process-constants';

export function startGethSuccess(data) {
    return {
        type: types.START_GETH_SUCCESS,
        data
    };
}

export function startGethError(data) {
    return {
        type: types.START_GETH_ERROR,
        data
    };
}

export function stopGethSuccess(data) {
    return {
        type: types.STOP_GETH_SUCCESS,
        data
    };
}

export function stopGethError(data) {
    return {
        type: types.STOP_GETH_ERROR,
        data
    };
}

export function startIPFSSuccess(data) {
    return {
        type: types.START_IPFS_SUCCESS,
        data
    };
}

export function startIPFSError(data) {
    return {
        type: types.START_IPFS_ERROR,
        data
    };
}

export function configIpfsSuccess(data) {
    return {
        type: types.CONFIG_IPFS_SUCCESS,
        data
    };
}

export function configIpfsError(data) {
    return {
        type: types.CONFIG_IPFS_ERROR,
        data
    };
}

export function stopIPFSSuccess(data) {
    return {
        type: types.STOP_IPFS_SUCCESS,
        data
    };
}

export function stopIPFSError(data) {
    return {
        type: types.STOP_IPFS_ERROR,
        data
    };
}
