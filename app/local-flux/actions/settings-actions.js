import { settingsActionCreators } from './action-creators';
import { SettingsService } from '../services';

let settingsActions = null;

class SettingsActions {
    constructor (dispatch) {
        if (settingsActions) {
            return settingsActions;
        }
        this.settingsService = new SettingsService();
        this.dispatch = dispatch;
        settingsActions = this;
    }
    // save app level settings
    saveSettings = (table, settings) => {
        this.dispatch(settingsActionCreators.saveSettings(table));
        this.settingsService.saveSettings({
            options: { table, settings },
            onSuccess: (data, tabl) => this.dispatch(
                settingsActionCreators.saveSettingsSuccess(settings, tabl)
            ),
            onError: (error, tabl) => this.dispatch(
                settingsActionCreators.saveSettingsError(error, tabl)
            ),
        });
    };

    getSettings = (table) => {
        this.dispatch(settingsActionCreators.startFetchingSettings(table));
        this.dispatch((dispatch) => {
            this.settingsService.getSettings({
                options: { table },
                onSuccess: (data) => {
                    dispatch(settingsActionCreators.getSettingsSuccess(data, table));
                    dispatch(settingsActionCreators.finishFetchingSettings(table));
                },
                onError: (err) => {
                    dispatch(settingsActionCreators.getSettingsError(err, table));
                    dispatch(settingsActionCreators.finishFetchingSettings(table));
                }
            });
        });
    };

    retrySetup = (isAdvanced) => {
        this.dispatch(settingsActionCreators.retrySetup(isAdvanced));
    };
    toggleAdvancedSettings = (isAdvanced) => {
        this.dispatch(settingsActionCreators.toggleAdvancedSettings(isAdvanced));
    };
    setupGethDataDir = (path) => {
        this.dispatch(settingsActionCreators.setupGethDataDir(path));
    };
    setupGethIPCPath = (path) => {
        this.dispatch(settingsActionCreators.setupGethIPCPath(path));
    };
    setupGethCacheSize = (size) => {
        this.dispatch(settingsActionCreators.setupGethCacheSize(size));
    };
    setupIPFSPath = (storagePath) => {
        this.dispatch(settingsActionCreators.setupIPFSPath(storagePath));
    };
    setupIPFSApiPort = (port) => {
        this.dispatch(settingsActionCreators.setupIPFSApiPort(port));
    };
    setupIPFSGatewayPort = (port) => {
        this.dispatch(settingsActionCreators.setupIPFSGatewayPort(port));
    };
    resetSettings = () => {
        this.dispatch(settingsActionCreators.resetSettings());
    };
    // save user level settings
    saveUserSettings = () => {};
    getUserSettings = () => {};

    changeTheme = theme =>
        this.dispatch(settingsActionCreators.changeTheme(theme));
}
export { SettingsActions };
