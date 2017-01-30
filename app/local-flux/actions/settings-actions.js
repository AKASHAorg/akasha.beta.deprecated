import { AppActions } from 'local-flux';
import { settingsActionCreators } from './action-creators';
import { NotificationsService, SettingsService } from '../services';

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

    getUserSettings = akashaId =>
        this.settingsService.getUserSettings({
            akashaId,
            onSuccess: data => this.dispatch(settingsActionCreators.getUserSettingsSuccess(data)),
            onError: error => this.dispatch(settingsActionCreators.getUserSettingsError(error))
        });

    disableNotifFrom = (akashaId, profileAddress) =>
        this.dispatch((dispatch, getState) => {
            this.notificationService.excludeFilter({ profiles: [profileAddress] });
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
            this.notificationActions.includeFilter([profileAddress]);
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

export { SettingsActions };
