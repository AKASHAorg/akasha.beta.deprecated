import { GethService, IpfsService } from '../services';
import { SettingsActions } from './';
import { externalProcessActionCreators, appActionCreators } from './action-creators';

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
        this.dispatch = dispatch;
        this.settingsActions = new SettingsActions(dispatch);
        this.gethService = new GethService();
        this.ipfsService = new IpfsService();
        return eProcActions;
    }
    startGeth = () =>
        this.settingsActions.getSettings('geth').then(() =>
            this.dispatch((dispatch, getState) => {
                const gethSettings = getState().settingsState.get('geth');
                if (gethSettings.size > 0) {
                    return gethSettings.toJS();
                }
                return {};
            })
        )
        .then(gethSettings =>
            this.gethService.startGeth(gethSettings)
        )
        .then(gethState => {
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
    startIPFS = () =>
        this.settingsActions.getSettings('ipfs').then(() => {
            this.dispatch((dispatch, getState) => {
                const ipfsSettings = getState().settingsState.get('ipfs');
                if (ipfsSettings.size > 0) {
                    return ipfsSettings.toJS();
                }
                return {};
            });
        })
        .then((ipfsSettings) => this.ipfsService.startIPFS(ipfsSettings))
        .then((ipfsState) => {
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
            dispatch(this._startIPFSError(reason));
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
    }
}
export { EProcActions };
