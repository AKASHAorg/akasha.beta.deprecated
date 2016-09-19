import debug from 'debug';
import { GethService, IpfsService } from '../services';
import {
    externalProcessActionCreators,
    appActionCreators,
    syncActionCreators } from './action-creators';

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
            code: error.code,
            fatal: error.fatal,
            message: error.message
        });

    startGeth = gethSettings =>
    this.gethService.getStatus().then((gethStatus) => {
        dbg('attempt to start geth with status', gethStatus);
        if (gethStatus.api || gethStatus.starting) {
            dbg('geth already started and is usable', gethStatus);
            return this.dispatch(
                externalProcessActionCreators.startGethSuccess({ gethStatus })
            );
        }
        dbg('starting geth with settings', gethSettings.toJS());
        this.gethService.start(gethSettings.toJS()).then((gethState) => {
            dbg('geth start status is', gethState);
            return this.dispatch(
                externalProcessActionCreators.startGethSuccess({ gethState })
            );
        })
        .catch(reason =>
            this.dispatch(
                this._showErrorAction({
                    code: 'EPA10',
                    fatal: reason.fatal,
                    message: reason.message || reason.stack
                })
            )
        );
    })


    stopGeth = () =>
        this.gethService.stop().then((data) => {
            if (!data) {
                return this.dispatch(
                    externalProcessActionCreators.stopGethError('Main process crashed')
                );
            }
            return this.dispatch(externalProcessActionCreators.stopGethSuccess(data));
        }).catch((reason) => {
            this.dispatch(externalProcessActionCreators.stopGethError(reason));
        });

    getGethStatus = () => {
        // return this.gethService.getStatus()
        // .then((data) => {
        //     dbg('getting geth status', data);
        //     return this.dispatch(externalProcessActionCreators.getGethStatusSuccess(data));
        // }).catch((reason) => {
        //     this.dispatch(externalProcessActionCreators.getGethStatusError(reason));
        // });
    }
    getGethOptions = () =>
        this.gethService.getOptions().then((data) => {
            dbg('geth config is', data);
            return this.dispatch(externalProcessActionCreators.getGethOptionsSuccess(data));
        }).catch((reason) => {
            this.dispatch(appActionCreators.showError({
                code: 'EPA15',
                fatal: reason.fatal,
                message: reason.message
            }));
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
