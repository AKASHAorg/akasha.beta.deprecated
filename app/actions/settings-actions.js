import * as types from '../constants/SettingsConstants';
import { AppActions } from './';
import { SettingsService } from '../services';

// save app level settings
class SettingsActions {
    constructor (dispatch) {
        this.settingsService = new SettingsService;
        this.appActions = new AppActions(dispatch);
        this.dispatch = dispatch;
    }
    saveSettings = (table, settings) =>
        this.settingsService.saveSettings(table, settings).then(() => {
            this.dispatch({ type: types.SAVE_SETTINGS_SUCCESS, settings, table });
        }).catch(reason => {
            this.dispatch({ type: types.SAVE_SETTINGS_ERROR, error: reason, table });
            throw reason;
        });

    getSettings (table) {
        return this.settingsService.getSettings(table).then((data) => {
            if (!data) {
                return this.dispatch({ type: types.GET_SETTINGS_ERROR, error: 'error?', table });
            }
            return this.dispatch({ type: types.GET_SETTINGS_SUCCESS, data, table });
        })
        .then(() => this.dispatch((dispatch, getState) => getState().settingsState.get(table)))
        .catch(reason => this.dispatch({ type: types.GET_SETTINGS_ERROR, error: reason, table }));
    }
    saveUserSettings () {}
    getUserSettings () {}
}
export { SettingsActions };
