import debug from 'debug';
import {
    EntryActions,
    ProfileActions,
    EProcActions,
    AppActions,
    SettingsActions,
    TagActions } from '../';

const dbg = debug('App:BootstrapBundleActions*');
let bootstrapActions = null;

class BootstrapBundleActions {
    constructor (dispatch) {
        if (!bootstrapActions) {
            bootstrapActions = this;
        }
        this.dispatch = dispatch;
        this.appActions = new AppActions(this.dispatch);
        this.entryActions = new EntryActions(this.dispatch);
        this.profileActions = new ProfileActions(this.dispatch);
        this.eProcActions = new EProcActions(this.dispatch);
        this.settingsActions = new SettingsActions(this.dispatch);
        this.tagActions = new TagActions(this.dispatch);
        return bootstrapActions;
    }
    initApp = (getState) => {
        // @TODO check for newer entries
        const promises = [];
        return Promise.all(promises);
    };
    bootApp = (getState) => {
        this.appActions.checkForUpdates();
    };
    initSetup = (getState) => {
        // @TODO load contents for tutorials
        this.settingsActions.getSettings('flags');
        this.settingsActions.getSettings('geth');
        this.settingsActions.getSettings('ipfs');
    };
    initConfig = (getState) => {

    };
    initSync = (getState) => {
        this.eProcActions.getGethStatus();
    };
    initAuth = (getState) => {
        const promises = [];
        promises.push(this.profileActions.getTempProfile());
        promises.push(this.tagActions.getTags({ fetchAll: true }));
        return Promise.all(promises).then(() => {
            const profileState = getState().profileState;
            const tempProfile = profileState.get('tempProfile');
            if (tempProfile.get('address')) {
                dbg('temp profile is', tempProfile);
            } else {
                this.profileActions.getLocalProfiles();
            }
        });
    };
    initHome = (getState) => {
        const promises = [];
        const loggedProfile = getState().profileState.get('loggedProfile');
        promises.push(this.entryActions.getDraftsCount(loggedProfile.get('userName')));
        promises.push(this.entryActions.getEntriesCount(loggedProfile.get('userName')));
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
    initEntryPage = () => {};
}

export { BootstrapBundleActions };
