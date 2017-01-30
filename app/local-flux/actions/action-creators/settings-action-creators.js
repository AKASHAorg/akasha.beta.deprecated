import * as types from '../../constants/SettingsConstants';

export function saveSettings (table) {
    return {
        type: types.SAVE_SETTINGS,
        table
    };
}

export function saveSettingsSuccess (settings, table) {
    return {
        type: types.SAVE_SETTINGS_SUCCESS,
        settings,
        table
    };
}

export function saveSettingsError (error, table) {
    return {
        type: types.SAVE_SETTINGS_ERROR,
        error,
        table
    };
}

export function getSettingsSuccess (data, table) {
    return {
        type: types.GET_SETTINGS_SUCCESS, data, table
    };
}

export function getSettingsError (error, table) {
    return {
        type: types.GET_SETTINGS_ERROR,
        error,
        table
    };
}

export function retrySetup (isAdvanced) {
    return {
        type: types.RETRY_SETUP,
        isAdvanced
    };
}

export function toggleAdvancedSettings (isAdvanced) {
    return {
        type: types.SETUP_ADVANCED_SETTINGS,
        isAdvanced
    };
}

export function setupGethDataDir (path) {
    return {
        type: types.SETUP_GETH_DATADIR,
        path
    };
}

export function setupGethIPCPath (path) {
    return {
        type: types.SETUP_GETH_IPCPATH,
        path
    };
}

export function setupGethCacheSize (size) {
    return {
        type: types.SETUP_GETH_CACHE_SIZE,
        size
    };
}

export function setupIPFSPath (storagePath) {
    return {
        type: types.SETUP_IPFS_PATH,
        storagePath
    };
}

export function setupIPFSApiPort (port) {
    return {
        type: types.SETUP_IPFS_API_PORT,
        port
    };
}

export function setupIPFSGatewayPort (port) {
    return {
        type: types.SETUP_IPFS_GATEWAY_PORT,
        port
    };
}

export function resetSettings () {
    return {
        type: types.RESET_SETTINGS
    };
}

export function startFetchingSettings (table) {
    return {
        type: types.START_FETCHING_SETTINGS,
        table
    };
}

export function finishFetchingSettings (table) {
    return {
        type: types.FINISH_FETCHING_SETTINGS,
        table
    };
}

export function changeTheme (theme) {
    return {
        type: types.CHANGE_THEME,
        theme
    };
}

export function getUserSettingsSuccess (data) {
    return {
        type: types.GET_USER_SETTINGS_SUCCESS,
        data
    };
}

export function getUserSettingsError (error) {
    return {
        type: types.GET_USER_SETTINGS_ERROR,
        error
    };
}

export function saveLatestMentionSuccess (data) {
    return {
        type: types.SAVE_LATEST_MENTION_SUCCESS,
        data
    };
}

export function saveLatestMentionError (error) {
    return {
        type: types.SAVE_LATEST_MENTION_ERROR,
        error
    };
}
