import * as types from '../../constants/SettingsConstants';

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
