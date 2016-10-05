import debug from 'debug';
import throttle from 'lodash.throttle';
import { GethService, IpfsService } from '../services';
import {
    externalProcessActionCreators,
    appActionCreators } from './action-creators';

const dbg = debug('App::eProcActions:');

let eProcActions = null;
/**
 * External processes actions (Geth, IPFS)
 *
 */
class EProcActions {
    constructor (dispatch) {
        if (!eProcActions) {
            eProcActions = this;
        }
        this.gethService = new GethService();
        this.ipfsService = new IpfsService();
        this.dispatch = dispatch;
        this.throttledSyncUpdate = throttle(this.getSyncStatus, 2000, {
            trailing: true,
            leading: true
        });
        return eProcActions;
    }

    _showErrorAction = error =>
        appActionCreators.showError({
            code: error.code ? error.code : '000',
            fatal: error.fatal,
            message: error.message
        });

    startGeth = (options) => {
        this.dispatch(externalProcessActionCreators.startGeth());
        this.gethService.start({
            options,
            onError: err => this.dispatch(externalProcessActionCreators.startGethError(err)),
            onSuccess: data => this.dispatch(externalProcessActionCreators.startGethSuccess(data))
        });
    }

    stopGeth = () => {
        this.dispatch(externalProcessActionCreators.stopGeth());
        this.gethService.stop({
            options: {},
            onError: err => this.dispatch(externalProcessActionCreators.stopGethError(err)),
            onSuccess: data => this.dispatch(externalProcessActionCreators.stopGethSuccess(data))
        });
    }

    getGethStatus = () =>
        this.gethService.getStatus({
            options: {},
            onError: err => this.dispatch(externalProcessActionCreators.getGethStatusError(err)),
            onSuccess: data => this.dispatch(
                externalProcessActionCreators.getGethStatusSuccess(data)
            )
        });

    getGethOptions = () =>
        this.gethService.getOptions({
            options: {},
            onError: err => this.dispatch(appActionCreators.showError(err)),
            onSuccess: data => this.dispatch(
                externalProcessActionCreators.getGethOptionsSuccess(data)
            )
        });
    startThrottledSync = () => {
        this.dispatch(externalProcessActionCreators.startSync());
        this.throttledSyncUpdate();
    }
    stopThrottledSync = () => {
        this.throttledSyncUpdate.cancel();
    }
    /**
     * get sync status of geth service
     * this method will not dispatch anything to avoid redux-dev-tools overload.
     * Should be called directly from inside component;
     */
    getSyncStatus = () =>
        this.gethService.getSyncStatus({
            options: {},
            onError: err => this.dispatch(appActionCreators.showError(err)),
            onSuccess: data => this.dispatch(
                externalProcessActionCreators.getSyncStatusSuccess(data)
            )
        });

    finishSync = () => {
        this.throttledSyncUpdate.cancel();
        this.gethService.closeSyncChannel();
    };
    // make sure to load settings before calling this one
    startIPFS = () => {
        this.dispatch(externalProcessActionCreators.startIPFS());
        this.dispatch((dispatch, getState) => {
            const ipfsSettings = getState().settingsState.get('ipfs').toJS();
            this.ipfsService.start({
                options: ipfsSettings,
                onError: err => dispatch(externalProcessActionCreators.startIPFSError(err)),
                onSuccess: data => dispatch(externalProcessActionCreators.startIPFSSuccess(data))
            });
        });
    }
    configIPFS = (config) => {
        this.ipfsService.configIpfs(config).then((data) => {
            if (!data.success) {
                return this.dispatch(externalProcessActionCreators.configIpfsError(data.status));
            }
            return this.dispatch(externalProcessActionCreators.configIpfsSuccess(data));
        }).catch(reason => this.dispatch(externalProcessActionCreators.configIpfsError(reason)));
    };

    stopIPFS = () => {
        this.dispatch(externalProcessActionCreators.stopIPFS());
        this.ipfsService.stop({
            options: {},
            onError: err => this.dispatch(externalProcessActionCreators.stopIPFSError(err)),
            onSuccess: data => this.dispatch(externalProcessActionCreators.stopIPFSSuccess(data)) 
        });
    };

    startSync = () => this.dispatch(externalProcessActionCreators.startSync());
    /**
     * Dispatcher for resuming sync
     * @returns {function()}
     */
    resumeSync = () =>
        this.dispatch(externalProcessActionCreators.resumeSync());

    pauseSync = () => {
        this.dispatch(externalProcessActionCreators.pauseSync());
        this.stopGeth();
    };
    /**
     * Action for stopping sync
     * @returns {{type}}
     */
    stopSync = () =>
        this.stopGeth({
            options: {},
            onError: err => this.dispatch(appActionCreators.showError(err)),
            onSuccess: data => this.dispatch(externalProcessActionCreators.stopSync(data))
        });

    filterLogs = (data, timestamp) => {
        let logs = [...data.gethError, ...data.gethInfo].filter(log => new Date(log.timestamp).getTime() > timestamp);
        return logs;
    }

    startGethLogger = (timestamp) =>
        this.gethService.getLogs({
            options: {},
            onError: err => this.dispatch(appActionCreators.showError(err)),
            onSuccess: data => this.dispatch(externalProcessActionCreators.getGethLogs(this.filterLogs(data, timestamp)))
        });

    stopGethLogger = () => this.gethService.stopGethLogger();
}
export { EProcActions };
