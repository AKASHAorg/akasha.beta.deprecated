import { SettingsActions, EProcActions } from '../';

let externalProcessBundleActions = null;

class ExternalProcessBundleActions {
    constructor (dispatch) {
        if (!externalProcessBundleActions) {
            externalProcessBundleActions = this;
        }
        this.dispatch = dispatch;
        this.settingsActions = new SettingsActions(this.dispatch);
        this.eProcActions = new EProcActions(dispatch);
        return externalProcessBundleActions;
    }
    startGeth = () =>
        this.settingsActions.getSettings('geth').then(() =>
            this.dispatch((dispatch, getState) => {
                const gethSettings = getState().settingsState.get('geth');
                if (gethSettings) {
                    return gethSettings.toJS();
                }
                return {};
            })
        )
        .then(gethSettings =>
            this.eProcActions.getGethStatus().then(() => {
                this.dispatch((dispatch, getState) => {
                    console.log(getState());
                    const gethStatus = getState().externalProcState.get('gethStatus');
                    if (!gethStatus.get('spawned') || !gethStatus.get('starting')) {
                        return this.eProcActions.startGeth(gethSettings);
                    }
                });
            })
        );
    startIPFS = () =>
        this.settingsActions.getSettings('ipfs').then(() => {
            this.dispatch((dispatch, getState) => {
                const ipfsSettings = getState().settingsState.get('ipfs');
                if (ipfsSettings.size > 0) {
                    return ipfsSettings.toJS();
                }
                return {};
            });
        }).then((ipfsSettings) => this.eProcActions.startIPFS(ipfsSettings));

    startSync = () =>
        this.dispatch(() =>
            this.startGeth()
        ).then(() =>
            this.eProcActions.startSync()
        );
    requestCancelSync = () =>
        this.dispatch(() =>
            this.settingsActions.saveSettings('flags', { requestStartupChange: true })
        ).then(() => {
            this.eProcActions.stopGeth();
            this.eProcActions.stopUpdateSync();
        });
}

export { ExternalProcessBundleActions };
