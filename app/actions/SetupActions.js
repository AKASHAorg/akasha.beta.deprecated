import { SetupService, SettingsService } from '../services';
import { hashHistory } from 'react-router';
import * as types from '../constants/SetupConstants';

class SetupActions {
    constructor (dispatch) {
        this.dispatch = dispatch;
        this.setupService = new SetupService;
        this.settingsService = new SettingsService;
    }
    startGeth = (options) => {
        let startupOptions = {};
        if (options) {
            startupOptions = {
                dataDir: options.dataDir,
                ipcPath: options.ipcPath,
                cache: options.cacheSize
            };
        }
        // return (dispatch, getState) => {
        //     this.setupService.startGeth(startupOptions).then((data) => {
        //         console.log(data);
        //     });
        // };
        this.setupService.startGeth(startupOptions).then((data) => {
            console.log(data);
            if (!data.success) {
                return this.dispatch(this._startGethError({ data }));
            }
            return this.dispatch(this._startGethSuccess(data));
        }).catch(err => this.dispatch(this._startGethError({ err })));
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
