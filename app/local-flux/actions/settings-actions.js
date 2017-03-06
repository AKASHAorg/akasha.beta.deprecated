import { AppActions } from 'local-flux';
import { settingsActionCreators } from './action-creators';
import { NotificationsService, SettingsService } from '../services';
import * as types from '../constants/SettingsConstants';

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

export function getSettingsRequest () {
    return {
        type: types.SETTINGS_REQUEST
    };
}

export function getSettingsSuccess () {
    return {
        type: types.SETTINGS_SUCCESS
    };
}

export function saveConfiguration (payload) {
    return {
        type: types.SAVE_CONFIGURATION,
        payload
    };
}

export function saveGeneralSettings (payload) {
    return {
        type: types.GENERAL_SETTINGS_SAVE_REQUEST,
        payload
    };
}

export function saveGeneralSettingsSuccess (data) {
    return {
        type: types.GENERAL_SETTINGS_SAVE_SUCCESS,
        data
    };
}

export function saveGeneralSettingsError (error) {
    return {
        type: types.GENERAL_SETTINGS_SAVE_ERROR,
        error
    };
}

export function saveGethSettings (payload) {
    return {
        type: types.GETH_SETTINGS_SAVE_REQUEST,
        payload
    };
}

export function saveGethSettingsSuccess (data) {
    return {
        type: types.GETH_SETTINGS_SAVE_SUCCESS,
        data
    };
}

export function saveGethSettingsError (error) {
    return {
        type: types.GETH_SETTINGS_SAVE_ERROR,
        error
    };
}

export function saveIpfsSettings (payload) {
    return {
        type: types.IPFS_SETTINGS_SAVE_REQUEST,
        payload
    };
}

export function saveIpfsSettingsSuccess (data) {
    return {
        type: types.IPFS_SETTINGS_SAVE_SUCCESS,
        data
    };
}

export function saveIpfsSettingsError (error) {
    return {
        type: types.IPFS_SETTINGS_SAVE_ERROR,
        error
    };
}

export function generalSettingsRequest () {
    return {
        type: types.GENERAL_SETTINGS_REQUEST,
    };
}

export function generalSettingsSuccess (data) {
    return {
        type: types.GENERAL_SETTINGS_SUCCESS,
        data
    };
}

export function generalSettingsError (error) {
    error.code = 'GSE01';
    return {
        type: types.GENERAL_SETTINGS_ERROR,
        error
    };
}

export function gethSettingsRequest () {
    return {
        type: types.GETH_SETTINGS_REQUEST,
    };
}

export function gethSettingsSuccess (data) {
    return {
        type: types.GETH_SETTINGS_SUCCESS,
        data
    };
}

export function gethSettingsError (error) {
    error.code = 'GETHSE01';
    return {
        type: types.GETH_SETTINGS_ERROR,
        error
    };
}

export function ipfsSettingsRequest () {
    return {
        type: types.IPFS_SETTINGS_REQUEST,
    };
}

export function ipfsSettingsSuccess (data) {
    return {
        type: types.IPFS_SETTINGS_SUCCESS,
        data
    };
}

export function ipfsSettingsError (error) {
    error.code = 'ISE01';
    return {
        type: types.IPFS_SETTINGS_ERROR,
        error
    };
}

export { SettingsActions };
