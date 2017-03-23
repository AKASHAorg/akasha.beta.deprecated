import { AppActions } from './';
import { settingsActionCreators } from './action-creators';
import { NotificationsService, SettingsService } from '../services';
import * as types from '../constants';
import { action } from './helpers';

let settingsActions = null;

class SettingsActions {
    constructor (dispatch) { // eslint-disable-line consistent-return
        if (settingsActions) {
            return settingsActions;
        }
        this.settingsService = new SettingsService();
        this.appActions = new AppActions(dispatch);
        this.notificationsService = new NotificationsService();
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

    changeTheme = theme =>
        this.dispatch(settingsActionCreators.changeTheme(theme));

    saveLastBlockNr = (akashaId, blockNr) => {
        if (akashaId && blockNr) {
            this.settingsService.saveLastBlockNr({
                akashaId,
                blockNr
            });
        }
    };

    saveLatestMention = (akashaId, timestamp) => {
        if (akashaId && timestamp) {
            this.settingsService.saveLatestMention({
                akashaId,
                timestamp,
                onSuccess: time =>
                    this.dispatch(settingsActionCreators.saveLatestMentionSuccess(time)),
                onError: error =>
                    this.dispatch(settingsActionCreators.saveLatestMentionError(error))
            });
        }
    };

    saveDefaultEntryLicence = (akashaId, licenceObj) => {
        this.settingsService.saveDefaultLicence({
            akashaId,
            licenceObj
        });
    };

    savePasswordPreference = (preference, akashaId) =>
        this.dispatch((dispatch, getState) => {
            const loggedAkashaId = getState().profileState.getIn(['loggedProfile', 'akashaId']);
            this.settingsService.savePasswordPreference({
                akashaId: akashaId || loggedAkashaId,
                preference,
                onSuccess: data =>
                    dispatch(settingsActionCreators.savePasswordPreferenceSuccess(data)),
                onError: error =>
                    dispatch(settingsActionCreators.savePasswordPreferenceError(error))
            });
        });

    getUserSettings = akashaId =>
        this.settingsService.getUserSettings({
            akashaId,
            onSuccess: data => this.dispatch(settingsActionCreators.getUserSettingsSuccess(data)),
            onError: error => this.dispatch(settingsActionCreators.getUserSettingsError(error))
        });

    cleanUserSettings = () =>
        this.dispatch(settingsActionCreators.cleanUserSettings());

    disableNotifFrom = (akashaId, profileAddress) =>
        this.dispatch((dispatch, getState) => {
            this.notificationsService.excludeFilter({ profiles: [profileAddress] });
            const loggedAkashaId = getState().profileState.getIn(['loggedProfile', 'akashaId']);
            this.settingsService.disableNotifFrom({
                loggedAkashaId,
                akashaId,
                profileAddress,
                onSuccess: (data) => {
                    this.getUserSettings(loggedAkashaId);
                    this.appActions.showNotification({
                        id: 'notificationsDisabledSuccess',
                        values: { akashaId: data },
                        duration: 3000
                    });
                },
                onError: (error, id) => this.appActions.showNotification({
                    id: 'notificationsDisabledError',
                    values: { akashaId: id }
                })
            });
        });

    enableNotifFrom = (akashaId, profileAddress) =>
        this.dispatch((dispatch, getState) => {
            this.notificationsService.includeFilter({ profiles: [profileAddress] });
            const loggedAkashaId = getState().profileState.getIn(['loggedProfile', 'akashaId']);
            this.settingsService.enableNotifFrom({
                loggedAkashaId,
                akashaId,
                profileAddress,
                onSuccess: (data) => {
                    this.getUserSettings(loggedAkashaId);
                    this.appActions.showNotification({
                        id: 'notificationsEnabledSuccess',
                        values: { akashaId: data },
                        duration: 3000
                    });
                },
                onError: (error, id) => this.appActions.showNotification({
                    id: 'notificationsEnabledError',
                    values: { akashaId: id }
                })
            });
        });
}

export const generalSettingsError = error => {
    error.code = 'GSE02';
    error.messageId = 'generalSettings';
    return action(types.GENERAL_SETTINGS_ERROR, { error });
};

export const generalSettingsRequest = () => action(types.GENERAL_SETTINGS);
export const generalSettingsSuccess = data => action(types.GENERAL_SETTINGS_SUCCESS, { data });
export const gethSaveSettings = (payload, showNotification) =>
    action(types.GETH_SAVE_SETTINGS, { payload, showNotification });

export const gethSaveSettingsError = error => {
    error.code = 'GSSE01';
    error.messageId = 'gethSaveSettings';
    return action(types.GETH_SAVE_SETTINGS_ERROR, { error });
};

export const gethSaveSettingsSuccess = data => action(types.GETH_SAVE_SETTINGS_SUCCESS, { data });

export const gethSettingsError = error => {
    error.code = 'GSE03';
    error.messageId = 'gethSettings';
    return action(types.GETH_SETTINGS_ERROR, { error });
};

export const gethSettingsRequest = () => action(types.GETH_SETTINGS);
export const gethSettingsSuccess = data => action(types.GETH_SETTINGS_SUCCESS, { data });
export const ipfsSaveSettings = (payload, showNotification) =>
    action(types.IPFS_SAVE_SETTINGS, { payload, showNotification });

export const ipfsSaveSettingsError = error => {
    error.code = 'ISSE01';
    error.messageId = 'ipfsSaveSettings';
    return action(types.IPFS_SAVE_SETTINGS_ERROR, { error });
};

export const ipfsSaveSettingsSuccess = data => action(types.IPFS_SAVE_SETTINGS_SUCCESS, { data });

export const ipfsSettingsError = error => {
    error.code = 'ISE01';
    error.message = 'ipfsSettings';
    return action(types.IPFS_SETTINGS_ERROR, { error });
};

export const ipfsSettingsSuccess = data => action(types.IPFS_SETTINGS_SUCCESS, { data });
export const ipfsSettingsRequest = () => action(types.IPFS_SETTINGS);
export const saveConfiguration = payload => action(types.SAVE_CONFIGURATION, { payload });
export const saveGeneralSettings = payload => action(types.GENERAL_SETTINGS_SAVE, { payload });

export const saveGeneralSettingsError = error => {
    error.code = 'SGSE01';
    error.messageId = 'saveGeneralSettings';
    return action(types.GENERAL_SETTINGS_SAVE_ERROR, { error });
};

export const saveGeneralSettingsSuccess = data => action(types.GENERAL_SETTINGS_SAVE_SUCCESS, { data });

export { SettingsActions };
