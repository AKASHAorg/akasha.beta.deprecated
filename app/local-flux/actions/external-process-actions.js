import throttle from 'lodash.throttle';
import { GethService, IpfsService } from '../services';
import {
    externalProcessActionCreators,
    appActionCreators } from './action-creators';

let eProcActions = null;
/**
 * External processes actions (Geth, IPFS)
 *
 */
class EProcActions {
    constructor (dispatch) { // eslint-disable-line consistent-return
        if (eProcActions) {
            return eProcActions;
        }
        this.gethService = new GethService();
        this.ipfsService = new IpfsService();
        this.dispatch = dispatch;
        this.throttledSyncUpdate = throttle(this.getSyncStatus, 2000, {
            trailing: true,
            leading: true
        });
        this.ipfsPortsRequest = null;
        eProcActions = this;
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
            onError: (err) => {
                this.dispatch(externalProcessActionCreators.startGethError(err));
                this.resetGethBusyState();
            },
            onSuccess: (data) => {
                this.dispatch(externalProcessActionCreators.startGethSuccess(data));
                this.resetGethBusyState();
            }
        });
    };

    registerStopGethListener = () => {
        this.gethService.registerStopListener({
            onError: (err) => {
                this.dispatch(externalProcessActionCreators.stopGethError(err));
                this.resetGethBusyState();
            },
            onSuccess: (data) => {
                this.dispatch(externalProcessActionCreators.stopGethSuccess(data));
                this.resetGethBusyState();
            }
        });
    };

    stopGeth = () => {
        this.dispatch(externalProcessActionCreators.stopGeth());
        this.gethService.stop({ options: {} });
    };

    getGethStatus = () =>
        this.gethService.getStatus({
            options: {},
            onError: err => this.dispatch(externalProcessActionCreators.getGethStatusError(err)),
            onSuccess: data => this.dispatch(
                externalProcessActionCreators.getGethStatusSuccess(data)
            )
        });

    getGethOptions = () => {
        this.gethService.getOptions({
            options: {},
            onError: err => this.dispatch(appActionCreators.showError(err)),
            onSuccess: data => this.dispatch(
                externalProcessActionCreators.getGethOptionsSuccess(data)
            )
        });
    };

    stopThrottledUpdate = () => {
        this.throttledSyncUpdate.cancel();
    };
    /**
     * get sync status of geth service
     * this method will not dispatch anything to avoid redux-dev-tools overload.
     * Should be called directly from inside component;
     */
    getSyncStatus = () =>
        this.gethService.getSyncStatus({
            options: {},
            onError: err => this.dispatch(appActionCreators.showError(err)),
            onSuccess: (data) => {
                this.dispatch(externalProcessActionCreators.getSyncStatusSuccess(data));
                if (data.synced) {
                    this.finishSync();
                }
            }
        });

    cancelSync = () => {
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
                onError: (err, data) => {
                    dispatch(externalProcessActionCreators.startIPFSError(err, data));
                    this.resetIpfsBusyState();
                },
                onSuccess: (data) => {
                    if (data.started) {
                        this.getIpfsPorts();
                        this.resetIpfsBusyState();
                    }
                    dispatch(externalProcessActionCreators.startIPFSSuccess(data));
                }
            });
        });
    };
    getIpfsStatus = () =>
        this.ipfsService.getStatus({
            options: {},
            onError: err => this.dispatch(externalProcessActionCreators.getIpfsStatusError(err)),
            onSuccess: data => this.dispatch(
                externalProcessActionCreators.getIpfsStatusSuccess(data)
            )
        });
    getIpfsConfig = () => {
        this.ipfsService.getConfig({
            options: {},
            onError: err => this.dispatch(externalProcessActionCreators.getIpfsConfigError(err)),
            onSuccess: data => this.dispatch(
                externalProcessActionCreators.getIpfsConfigSuccess(data)
            )
        });
    };
    getIpfsPorts = () => {
        this.dispatch(externalProcessActionCreators.getIpfsPorts());
        this.ipfsPortsRequest = setTimeout(() => {
            this.ipfsService.getPorts({
                options: {},
                onError: err => this.dispatch(externalProcessActionCreators.getIpfsPortsError(err)),
                onSuccess: data => this.dispatch(
                    externalProcessActionCreators.getIpfsPortsSuccess(data)
                )
            });
        }, 2000);
    };
    registerStopIpfsListener = () => {
        this.ipfsService.registerStopListener({
            onError: (err) => {
                this.dispatch(externalProcessActionCreators.stopIPFSError(err));
                this.resetIpfsBusyState();
            },
            onSuccess: (data) => {
                this.dispatch(externalProcessActionCreators.stopIPFSSuccess(data));
                this.resetIpfsBusyState();
            }
        });
    };
    stopIPFS = () => {
        this.dispatch(externalProcessActionCreators.stopIPFS());
        this.dispatch(externalProcessActionCreators.resetIpfsPorts());
        if (this.ipfsPortsRequest) {
            clearTimeout(this.ipfsPortsRequest);
        }
        this.ipfsService.stop({ options: {} });
    };

    startSync = () => this.dispatch(externalProcessActionCreators.startSync());
    /**
     * Dispatcher for resuming sync
     * @returns {function()}
     */
    resumeSync = () => {
        this.dispatch(externalProcessActionCreators.resumeSync());
        this.startGeth();
    }

    pauseSync = () => {
        this.dispatch(externalProcessActionCreators.pauseSync());
        this.stopGeth();
    };
    /**
     * Action for stopping sync
     * @returns {{type}}
     */
    stopSync = () => {
        this.dispatch(externalProcessActionCreators.stopSync());
        this.stopGeth();
    }
    finishSync = () => {
        this.dispatch(externalProcessActionCreators.finishSync());
    }

    resetGethBusyState = () =>
        setTimeout(() => this.dispatch(externalProcessActionCreators.resetGethBusy()), 2000);

    resetIpfsBusyState = () =>
        setTimeout(() => this.dispatch(externalProcessActionCreators.resetIpfsBusy()), 2000);

    filterLogs = (data, timestamp) => {
        const logs = [...data.gethError, ...data.gethInfo]
            .filter(log => new Date(log.timestamp).getTime() > timestamp);
        return logs;
    }

    startGethLogger = timestamp =>
        this.gethService.getLogs({
            options: {},
            onError: err => this.dispatch(appActionCreators.showError(err)),
            onSuccess: data =>
                this.dispatch(externalProcessActionCreators.getGethLogs(
                    this.filterLogs(data, timestamp)
                ))
        });

    stopGethLogger = () => this.gethService.stopGethLogger();
}
export { EProcActions };
