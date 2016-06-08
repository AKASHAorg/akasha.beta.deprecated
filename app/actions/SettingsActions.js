import * as types from '../constants/SettingsConstants';
import settingsService from '../services/settings-service';

// save app level settings
export function saveSettings (table, settings) {
    return dispatch => {
        settingsService.saveSettings(table, settings).then(() => {
            dispatch({ type: types.SAVE_SETTINGS_SUCCESS });
        });
    };
}

export function getSettings () {}
export function saveUserSettings () {}
export function getUserSettings () {}
