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
    bootApp = () => {
        this.appActions.checkForUpdates();
    };
    initSetup = () => {
        // @TODO load contents for tutorials
        this.settingsActions.getSettings('flags');
        this.settingsActions.getSettings('geth');
        this.settingsActions.getSettings('ipfs');
    };
    initConfig = () => {

    };
    initSync = () => {
        this.eProcActions.getGethStatus();
    };
    initAuth = () => {
        const promises = [];
        promises.push(this.profileActions.getTempProfile());
        promises.push(this.tagActions.getTags({ fetchAll: true }));
        return Promise.all(promises);
    };
    initHome = () => {
        const promises = [];
        return Promise.all();
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
