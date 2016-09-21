import debug from 'debug';
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
        return eProcActions;
    }

    _showErrorAction = error =>
        appActionCreators.showError({
            code: error.code ? error.code : '000',
            fatal: error.fatal,
            message: error.message
        });

    startGeth = gethSettings =>
        this.gethService.start({
            options: gethSettings.toJS(),
            dispatch: this.dispatch,
            onError: externalProcessActionCreators.startGethError,
            onSuccess: externalProcessActionCreators.startGethSuccess
        });

    stopGeth = () =>
        this.gethService.stop({
            options: {},
            dispatch: this.dispatch,
            onError: externalProcessActionCreators.stopGethError,
            onSuccess: externalProcessActionCreators.stopGethSuccess
        });

    getGethStatus = () =>
        this.gethService.getStatus({
            options: {},
            dispatch: this.dispatch,
            onError: externalProcessActionCreators.getGethStatusError,
            onSuccess: externalProcessActionCreators.getGethStatusSuccess
        });

    getGethOptions = () =>
        this.gethService.getOptions({
            options: {},
            dispatch: this.dispatch,
            onError: appActionCreators.showError,
            onSuccess: externalProcessActionCreators.getGethOptionsSuccess
        });
    /**
     * get sync status of geth service
     * this method will not dispatch anything to avoid redux-dev-tools overload.
     * Should be called directly from inside component;
     */
    getSyncStatus = () =>
        this.gethService.getSyncStatus({
            options: {},
            dispatch: this.dispatch,
            onError: appActionCreators.showError,
            onSuccess: externalProcessActionCreators.getSyncStatusSuccess
        });

    startIPFS = ipfsSettings =>
        this.ipfsService.startIPFS(ipfsSettings).then((ipfsState) => {
            if (!ipfsState.success) {
                return this.dispatch(
                    externalProcessActionCreators.startIPFSSuccess({ data: ipfsState })
                );
            }
            return this.dispatch(
                externalProcessActionCreators.startIPFSSuccess({ data: ipfsState })
            );
        })
        .catch(reason => this.dispatch((dispatch) => {
            dispatch(externalProcessActionCreators.startIPFSError(reason));
            dispatch(
                appActionCreators.showError({
                    code: 205,
                    fatal: reason.fatal,
                    message: 'Ipfs process cannot be started!'
                })
            );
        }));

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
            dispatch: this.dispatch,
            onError: appActionCreators.showError,
            onSuccess: externalProcessActionCreators.stopSync
        })
}
export { EProcActions };
