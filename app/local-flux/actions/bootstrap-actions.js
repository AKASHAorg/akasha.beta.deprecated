import {
    EntryActions,
    ProfileActions,
    EProcActions,
    AppActions,
    SettingsActions,
    TagActions } from './';
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
        this.tagActions = new TagActions(dispatch);
        this.dispatch = dispatch;
        return bootstrapActions;
    }
    initApp = (getState) => {
        // @TODO check for newer entries
        const promises = [];
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
    initAuth = (getState) => {
        const promises = [];
        promises.push(this.profileActions.getTempProfile());
        promises.push(this.profileActions.checkLoggedProfile());
        return Promise.all(promises).then(() => {
            const profileState = getState().profileState;
            const tempProfile = getState().profileState.get('tempProfile');
            const loggedProfile = profileState.get('loggedProfile');
            if (tempProfile.get('address')) {
                console.log('temp profile is: ', tempProfile);
            } else if (loggedProfile.get('address')) {
                console.log('logged profile is: ', loggedProfile);
            } else {
                this.profileActions.getLocalProfiles();
            }
        });
    };
    initHome = (getState) => {
        const promises = [];
        promises.push(this.profileActions.checkLoggedProfile());
        promises.push(this.entryActions.getDraftsCount());
        promises.push(this.entryActions.getEntriesCount());
        promises.push(this.tagActions.getTags());
        return Promise.all(promises);
    };
    initEntryEditor = (getState, params) => {
        const promises = [];
        if (params.draftId) {
            // load draft with draftId
            promises.push(this.entryActions.getDraftById(params.draftId));
        }
        return Promise.all(promises);
    };
    initStreamPage = () => {};
}

export { BootstrapActions };
