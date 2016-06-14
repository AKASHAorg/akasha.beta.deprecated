import { SetupService } from '../services';
import { SettingsActions } from './SettingsActions';
import { AppActions } from './AppActions';
import { hashHistory } from 'react-router';
import * as types from '../constants/SetupConstants';

class SetupActions {
    constructor (dispatch) {
        this.dispatch = dispatch;
        this.setupService = new SetupService;
        this.settingsActions = new SettingsActions(dispatch);
        this.appActions = new AppActions(dispatch);
    }
    startGeth = () => {
        this.settingsActions.getSettings('geth').then(() => {
            this.dispatch((dispatch, getState) => {
                const gethSettings = getState().settingsState.get('geth');
                if (gethSettings.size > 0) {
                    console.info('starting geth with options', gethSettings.first().toJS());
                    return this.startGethWithOptions(gethSettings.first().toJS());
                }
            });
        });
        this.setupService.startGeth().then((data) => {
            // if geth is already running do nothing
            if (data.isRunning) {
                return Promise.resolve();
            }
            // if geth could not start return an error and alert user
            if (!data.success) {
                const error = new Error(` ${data.status}`);
                return Promise.reject(this.dispatch(this._startGethError(error)));
            }
            return Promise.resolve(this.dispatch(this._startGethSuccess({ data })));
        })
        .catch(reason => this.dispatch(() => {
            this.appActions.showError({
                code: 105,
                type: reason.type ? reason.type : 'GETH_START_ERROR',
                message: reason.data ? reason.data.message : reason.stack()
            });
        }));
    }
    startGethWithOptions = (options) => {
        const startupOptions = {
            dataDir: options.dataDir,
            ipcPath: options.ipcPath,
            cache: options.cacheSize
        };

        this.setupService.startGeth(startupOptions).then((data) => {
            // if geth is already running do nothing
            if (data.isRunning) {
                return Promise.resolve();
            }
            if (!data.success) {
                const error = new Error(` ${data.status}`);
                return Promise.reject(this.dispatch(this._startGethError(error)));
            }
            return Promise.resolve(this.dispatch(this._startGethSuccess({ data })));
        })
        .then(() => {
            this.dispatch((dispatch, getState) => {
                const gethSettings = getState().setupConfig.get('geth');
                if (gethSettings.get('started') && options) {
                    this.settingsActions.saveSettings('geth', startupOptions);
                }
            });
        })
        .catch(reason => this.dispatch(() => {
            this.appActions.showError({
                code: 105,
                type: reason.type ? reason.type : 'GETH_START_ERROR',
                message: reason.data ? reason.data.message : reason
            });
        }));
    }
    stopGeth = () => {
        this.setupService.stopGeth().then(data => {
            if (!data) {
                return this.dispatch(this._stopGethError('Main process crashed'));
            }
            return this.dispatch(this._stopGethSuccess(data));
        }).catch(reason => {
            this.dispatch(this._stopGethError(reason));
        });
    }
    startIPFS = (options) => {
        this.setupService.startIPFS(options).then(data => {
            if (!data.success) {
                return this.dispatch(this._startIPFSError(data));
            }
            return this.dispatch(this._startIPFSSuccess(data));
        }).catch(reason => this.dispatch(this._startIPFSError(reason)));
    }
    stopIPFS = () => {
        this.setupService.stopIPFS().then((data) => {
            if (!data.success) {
                return this.dispatch(this._stopIPFSError(data));
            }
            return this.dispatch(this._stopIPFSSuccess(data));
        }).catch(reason => this.dispatch(this._stopIPFSError(reason)));
    }
    retrySetup = (isAdvanced) => {
        this.dispatch({ type: types.RETRY_SETUP, isAdvanced });
    }
    toggleAdvancedSettings = (isAdvanced) => {
        this.dispatch({ type: types.SETUP_ADVANCED_SETTINGS, isAdvanced });
    }
    setupGethDataDir = (path) => {
        this.dispatch({ type: types.SETUP_GETH_DATADIR, path });
    }
    setupGethIPCPath = (path) => {
        this.dispatch({ type: types.SETUP_GETH_IPCPATH, path });
    }
    setupGethCacheSize = (size) => {
        this.dispatch({ type: types.SETUP_GETH_CACHE_SIZE, size });
    }
    setupIPFSApiPort = (port) => {
        this.dispatch({ type: types.SETUP_IPFS_API_PORT, port });
    }
    setupIPFSGatewayPort = (port) => {
        this.dispatch({ type: types.SETUP_IPFS_GATEWAY_PORT, port });
    }

    _startGethSuccess = (data) => {
        // this.settingsService.saveSettings('geth', data);
        return { type: types.START_GETH_SUCCESS, data };
    }
    _startGethError (data) {
        return { type: types.START_GETH_ERROR, data };
    }
    _stopGethSuccess (data) {
        return { type: types.STOP_GETH_SUCCESS, data };
    }
    _stopGethError (data) {
        return { type: types.STOP_GETH_ERROR, data };
    }
    _startIPFSSuccess (data) {
        // this.settingsService.saveSettings('ipfs', data);
        return { type: types.START_IPFS_SUCCESS, data };
    }
    _startIPFSError (data) {
        return { type: types.START_IPFS_ERROR, data };
    }
    _stopIPFSSuccess (data) {
        return { type: types.STOP_IPFS_SUCCESS, data };
    }
    _stopIPFSError (data) {
        return { type: types.STOP_IPFS_ERROR, data };
    }
}

export { SetupActions };
