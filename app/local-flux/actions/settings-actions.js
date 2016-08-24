import { settingsActionCreators } from './action-creators';
import { SettingsService } from '../services';

let settingsActions = null;

class SettingsActions {
    constructor (dispatch) {
        if (!settingsActions) {
            settingsActions = this;
        }
        this.settingsService = new SettingsService();
        this.dispatch = dispatch;
        return settingsActions;
    }
    // save app level settings
    saveSettings = (table, settings) =>
        this.settingsService.saveSettings(table, settings).then(() =>
            this.dispatch(settingsActionCreators.saveSettingsSuccess(settings, table))
        ).catch(reason => this.dispatch(settingsActionCreators.saveSettingsError(reason, table)));

    getSettings (table) {
        return this.settingsService.getSettings(table).then((data) => {
            if (!data) {
                return this.dispatch(settingsActionCreators.getSettingsError('No data!', table));
            }
            return this.dispatch(settingsActionCreators.getSettingsSuccess(data, table));
        })
        .then(() => this.dispatch((dispatch, getState) => getState().settingsState.get(table)))
        .catch(reason => this.dispatch(settingsActionCreators.getSettingsError(reason, table)));
    }
    // save user level settings
    saveUserSettings () {}
    getUserSettings () {}
}
export { SettingsActions };
