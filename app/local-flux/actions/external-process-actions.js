import { GethService, IpfsService, SetupService } from '../services';
import {
    externalProcessActionCreators,
    appActionCreators,
    syncActionCreators } from './action-creators';

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
        this.setupService = new SetupService();
        this.dispatch = dispatch;
        return eProcActions;
    }
    startGeth = (gethSettings) =>
        this.gethService.startGeth(gethSettings).then(gethState => {
            if (gethState.isRunning) {
                return Promise.resolve();
            }
            // if geth could not start return an error and alert user
            if (!gethState.success) {
                const error = new Error(` ${gethState.status}`);
                return this.dispatch(externalProcessActionCreators.startGethError(error));
            }
            return this.dispatch(
                externalProcessActionCreators.startGethSuccess({ data: gethState })
            );
        })
        .catch(reason => this.dispatch(
            appActionCreators.showError({
                code: 105,
                type: reason.type ? reason.type : 'GETH_START_ERROR',
                message: reason.data ? reason.data.message : reason.stack
            })
        ));

    stopGeth = () => {
        this.gethService.stopGeth().then(data => {
            if (!data) {
                return this.dispatch(
                    externalProcessActionCreators.stopGethError('Main process crashed')
                );
            }
            return this.dispatch(externalProcessActionCreators.stopGethSuccess(data));
        }).catch(reason => {
            this.dispatch(externalProcessActionCreators.stopGethError(reason));
        });
    };
    getGethStatus = () => {
        this.gethService.getStatus().then(data => {
            if (!data) {
                return this.dispatch(
                    externalProcessActionCreators.getGethStatusError('Main process crashed')
                );
            }
            return this.dispatch(externalProcessActionCreators.getGethStatusSuccess(data));
        }).catch(reason => {
            this.dispatch(externalProcessActionCreators.getGethStatusError(reason));
        });
    };
    startIPFS = (ipfsSettings) =>
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
                    type: reason.type ? reason.type : 'IPFS_START_ERROR',
                    message: 'Ipfs process cannot be started!'
                })
            );
        }));
    configIPFS = (config) => {
        this.ipfsService.configIpfs(config).then(data => {
            if (!data.success) {
                return this.dispatch(externalProcessActionCreators.configIpfsError(data.status));
            }
            return this.dispatch(externalProcessActionCreators.configIpfsSuccess(data));
        }).catch(reason => this.dispatch(externalProcessActionCreators.configIpfsError(reason)));
    };
    stopIPFS = () => {
        this.ipfsService.stopIPFS().then(data => {
            if (!data.success) {
                return this.dispatch(
                    externalProcessActionCreators.stopIPFSError(data.status.error)
                );
            }
            return this.dispatch(externalProcessActionCreators.stopIPFSSuccess(data));
        }).catch(reason => this.dispatch(externalProcessActionCreators.stopIPFSError(reason)));
    };
    startSync = () => this.dispatch(syncActionCreators.startSync());
    /**
     * Dispatcher for resuming sync
     * @returns {function()}
     */
    resumeSync = () => this.dispatch(syncActionCreators.resumeSync());
    pauseSync = () => {
        this.stopUpdateSync(() => {
            this.dispatch(syncActionCreators.pauseSync());
            this.eProcActions.stopGeth();
        });
    };
    /**
     * Action for stopping sync
     * @returns {{type}}
     */
    stopSync = () =>
        this.dispatch(() => this.stopUpdateSync().then(() => syncActionCreators.stopSync()));
    startUpdateSync = (cb) => {
        this.setupService.startUpdateSync(cb);
    };
    stopUpdateSync = () =>
        this.setupService.stopUpdateSync();
}
export { EProcActions };
