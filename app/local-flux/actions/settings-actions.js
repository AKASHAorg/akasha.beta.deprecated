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
        this.settingsService.saveSettings({
            options: { table, settings },
            onSuccess: (data, table) => this.dispatch(settingsActionCreators.saveSettingsSuccess(settings, table)),
            onError: (error, table) => this.dispatch(settingsActionCreators.saveSettingsError(error, table)),
        });

    getSettings = table =>
        this.dispatch((dispatch) => {
            this.settingsService.getSettings({
                options: { table },
                onSuccess: data => dispatch(settingsActionCreators.getSettingsSuccess(data)),
                onError: err => dispatch(settingsActionCreators.getSettingsError(err))
            });
        });

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
    }
    // save user level settings
    saveUserSettings = () => {}
    getUserSettings = () => {}
}
export { SettingsActions };
