import { SetupService } from '../services';
import { AppActions, SettingsActions } from './';
import { hashHistory } from 'react-router';
import * as types from '../constants/SetupConstants';

class SetupActions {
    constructor (dispatch) {
        this.dispatch = dispatch;
        this.setupService = new SetupService;
        this.settingsActions = new SettingsActions(dispatch);
        this.appActions = new AppActions(dispatch);
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
    setupIPFSPath = (path) => {
        this.dispatch({ type: types.SETUP_IPFS_PATH, path });
    }
    setupIPFSApiPort = (port) => {
        this.dispatch({ type: types.SETUP_IPFS_API_PORT, port });
    }
    setupIPFSGatewayPort = (port) => {
        this.dispatch({ type: types.SETUP_IPFS_GATEWAY_PORT, port });
    }
}

export { SetupActions };
