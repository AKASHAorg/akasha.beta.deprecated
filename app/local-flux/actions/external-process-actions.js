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

    startGeth = () =>
        this.dispatch((dispatch, getState) => {
            const gethStatus = getState().externalProcState.get('gethStatus');
            if (gethStatus.get('started') || gethStatus.get('starting') || gethStatus.get('api')) {
                dbg('Geth already started!');
                return;
            }
            this.gethService.start({
                options: getState().settingsState.get('geth').toJS(),
                onError: err => dispatch(externalProcessActionCreators.startGethError(err)),
                onSuccess: data => dispatch(externalProcessActionCreators.startGethSuccess(data))
            });
        });

    stopGeth = () =>
        this.gethService.stop({
            options: {},
            onError: err => this.dispatch(externalProcessActionCreators.stopGethError(err)),
            onSuccess: data => this.dispatch(externalProcessActionCreators.stopGethSuccess(data))
        });

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

    startIPFS = () =>
        this.dispatch((dispatch, getState) => {
            const ipfsSettings = getState().settingsState.get('ipfs').toJS();
            this.ipfsService.start({
                options: ipfsSettings,
                onError: err => dispatch(externalProcessActionCreators.startIPFSError(err)),
                onSuccess: data => dispatch(externalProcessActionCreators.startIPFSSuccess(data))
            });
        });

    configIPFS = (config) => {
        this.ipfsService.configIpfs(config).then((data) => {
            if (!data.success) {
                return this.dispatch(externalProcessActionCreators.configIpfsError(data.status));
            }
            return this.dispatch(externalProcessActionCreators.configIpfsSuccess(data));
        }).catch(reason => this.dispatch(externalProcessActionCreators.configIpfsError(reason)));
    };

    stopIPFS = () => {
        this.ipfsService.stopIPFS().then((data) => {
            if (!data.success) {
                return this.dispatch(
                    externalProcessActionCreators.stopIPFSError(data.status.error)
                );
            }
            return this.dispatch(externalProcessActionCreators.stopIPFSSuccess(data));
        }).catch(reason => this.dispatch(externalProcessActionCreators.stopIPFSError(reason)));
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
        })
}
export { EProcActions };
