import * as types from '../../constants/SetupConstants';

export function retrySetup (isAdvanced) {
    return { type: types.RETRY_SETUP,
        isAdvanced
    };
}

export function toggleAdvancedSettings (isAdvanced) {
    return { type: types.SETUP_ADVANCED_SETTINGS,
        isAdvanced
    };
}

export function setupGethDataDir (path) {
    return { type: types.SETUP_GETH_DATADIR,
        path
    };
}

export function setupGethIPCPath (path) {
    return { type: types.SETUP_GETH_IPCPATH,
        path
    };
}

export function setupGethCacheSize (size) {
    return { type: types.SETUP_GETH_CACHE_SIZE,
        size
    };
}

export function setupIPFSPath (path) {
    return { type: types.SETUP_IPFS_PATH,
        path
    };
}

export function setupIPFSApiPort (port) {
    return { type: types.SETUP_IPFS_API_PORT,
        port
    };
}

export function setupIPFSGatewayPort (port) {
    return { type: types.SETUP_IPFS_GATEWAY_PORT,
        port
    };
}
