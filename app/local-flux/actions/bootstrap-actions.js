import { EntryActions, ProfileActions, EProcActions, AppActions, SettingsActions } from './';
import { hashHistory } from 'react-router';
let bootstrapActions = null;

class BootstrapActions {
    constructor (dispatch) {
        if (!bootstrapActions) {
            bootstrapActions = this;
        }
        this.entryActions = new EntryActions(dispatch);
        this.profileActions = new ProfileActions(dispatch);
        this.appActions = new AppActions(dispatch);
        this.eProcActions = new EProcActions(dispatch);
        this.settingsActions = new SettingsActions(dispatch);
        this.dispatch = dispatch;
        return bootstrapActions;
    }
    initApp = (getState) => {
        // @TODO check for newer entries
        const promises = [];
        // promises.push(this.entryActions.getEntriesCount());
        // promises.push(this.entryActions.getDraftsCount());
        return Promise.all(promises);
    };
    bootApp = (getState) => {
        const promises = [];
        promises.push(this.appActions.checkForUpdates());
        promises.push(this.eProcActions.getGethStatus());
        return Promise.all(promises);
    };
    initSetup = (getState) => {
        // @TODO load contents for tutorials
        const promises = [];
        promises.push(this.settingsActions.getSettings('flags'));
        return Promise.all(promises);
    };
    initConfig = (getState) => {
        const promises = [];
        promises.push(this.settingsActions.getSettings('geth'));
        promises.push(this.settingsActions.getSettings('ipfs'));
        return Promise.all(promises);
    };
    initStreamPage = () => {};
}

export { BootstrapActions };
