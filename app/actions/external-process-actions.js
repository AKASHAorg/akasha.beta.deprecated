import { GethService, IpfsService } from '../services';
import { SettingsActions, AppActions } from './';
import * as types from '../constants/external-process-constants';
/**
 * External processes actions (Geth, IPFS)
 *
 */
class EProcActions {
    constructor (dispatch) {
        this.dispatch = dispatch;
        this.settingsActions = new SettingsActions(dispatch);
        this.appActions = new AppActions(dispatch);
        this.gethService = new GethService;
        this.ipfsService = new IpfsService;
    }
    startGeth = () =>
        this.settingsActions.getSettings('geth').then(() =>
            this.dispatch((dispatch, getState) => {
                const gethSettings = getState().settingsState.get('geth');
                if (gethSettings.size > 0) {
                    return gethSettings.first().toJS();
                }
                return {};
            })
        )
        .then(gethSettings =>
            this.gethService.startGeth(gethSettings)
        )
        .then(gethState => {
            // if geth is already running do nothing
            if (gethState.isRunning) {
                return Promise.resolve();
            }
            // if geth could not start return an error and alert user
            if (!gethState.success) {
                const error = new Error(` ${gethState.status}`);
                return Promise.reject(this.dispatch(this._startGethError(error)));
            }
            return Promise.resolve(this.dispatch(this._startGethSuccess({ data: gethState })));
        })
        .catch(reason => this.dispatch(() => {
            this.appActions.showError({
                code: 105,
                type: reason.type ? reason.type : 'GETH_START_ERROR',
                message: reason.data ? reason.data.message : reason.stack
            });
        }));

    stopGeth = () => {
        this.gethService.stopGeth().then(data => {
            if (!data) {
                return this.dispatch(this._stopGethError('Main process crashed'));
            }
            return this.dispatch(this._stopGethSuccess(data));
        }).catch(reason => {
            this.dispatch(this._stopGethError(reason));
        });
    }
    startIPFS = () =>
        this.settingsActions.getSettings('ipfs').then(() => {
            this.dispatch((dispatch, getState) => {
                const ipfsSettings = getState().settingsState.get('ipfs');
                if (ipfsSettings.size > 0) {
                    return ipfsSettings.first().toJS();
                }
                return {};
            });
        })
        .then((ipfsSettings) => this.ipfsService.startIPFS(ipfsSettings))
        .then((ipfsState) => {
            if (!ipfsState.success) {
                return Promise.resolve(this.dispatch(this._startIPFSSuccess({ data: ipfsState })));
            }
            return Promise.resolve(this.dispatch(this._startIPFSSuccess({ data: ipfsState })));
        })
        .catch(reason => this.dispatch(() => {
            this.dispatch(this._startIPFSError(reason));
            console.error(reason);
            this.appActions.showError({
                code: 205,
                type: reason.type ? reason.type : 'IPFS_START_ERROR',
                message: 'Ipfs process cannot be started!'
            });
        }));
    configIPFS = (config) => {
        this.ipfsService.configIpfs(config).then(data => {
            if (!data.success) {
                return this.dispatch(this._configIpfsError(data.status));
            }
            return this.dispatch(this._configIpfsSuccess(data));
        }).catch(reason => this.dispatch(this._configIpfsError(reason)));
    }
    stopIPFS = () => {
        this.ipfsService.stopIPFS().then((data) => {
            if (!data.success) {
                return this.dispatch(this._stopIPFSError(data));
            }
            return this.dispatch(this._stopIPFSSuccess(data));
        }).catch(reason => this.dispatch(this._stopIPFSError(reason)));
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
    _configIpfsSuccess (data) {
        return { type: types.CONFIG_IPFS_SUCCESS, data };
    }
    _configIpfsError (data) {
        return { type: types.CONFIG_IPFS_ERROR, data };
    }
    _stopIPFSSuccess (data) {
        return { type: types.STOP_IPFS_SUCCESS, data };
    }
    _stopIPFSError (data) {
        return { type: types.STOP_IPFS_ERROR, data };
    }
}

export { EProcActions };
