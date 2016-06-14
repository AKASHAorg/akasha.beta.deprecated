import * as types from '../constants/SettingsConstants';
import { SettingsService } from '../services';

// save app level settings
class SettingsActions {
    constructor () {
        this.settingsService = new SettingsService;
    }
    saveSettings = (table, settings) => {
        console.log(settings, 'save this settings');
        return dispatch => {
            this.settingsService.saveSettings(table, settings).then(() => {
                dispatch({ type: types.SAVE_SETTINGS_SUCCESS, data: { table, settings } });
            });
        };
    }
    getSettings () {}
    saveUserSettings () {}
    getUserSettings () {}
}
export { SettingsActions };
