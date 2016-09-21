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

    getSettings = table =>
        this.settingsService.getSettings(table).then(data =>
            this.dispatch(settingsActionCreators.getSettingsSuccess(data, table))
        ).catch(reason => this.dispatch(settingsActionCreators.getSettingsError(reason, table)));

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
    setupIPFSPath = (path) => {
        this.dispatch(settingsActionCreators.setupIPFSPath(path));
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
