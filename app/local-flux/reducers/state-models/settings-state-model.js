import { List, Record } from 'immutable';
import { License } from './license-state-model';

export const GethSettings = Record({
    autodag: null,
    cache: '',
    datadir: null,
    fast: null,
    ipcpath: null,
    mine: null,
    minerthreads: null,
    networkid: null,
    syncmode: 'fast',
});

export const PortsRecord = Record({
    apiPort: null,
    gatewayPort: null,
    swarmPort: null
});

export const IpfsSettings = Record({
    ports: new PortsRecord(),
    storagePath: null,
});

export const HiddenContent = Record({
    checked: true,
    value: -30
});

export const NotificationsPreference = Record({
    feed: true,
    donations: true,
    comments: true,
    votes: true
});

export const PasswordPreference = Record({
    remember: false,
    time: null
});

export const UserSettings = Record({
    ethAddress: null,
    lastBlockNr: null,
    latestMention: null,
    defaultLicense: License(),
    hideCommentContent: new HiddenContent(),
    hideEntryContent: new HiddenContent(),
    notificationsPreference: new NotificationsPreference(),
    passwordPreference: new PasswordPreference(),
    trustedDomains: new List()
});

export const GeneralSettings = Record({
    theme: 'light',
    configurationSaved: false,
    darkTheme: false,
    locale: 'en'
});

const Flags = Record({
    generalSettingsPending: false,
    savingGethSettings: false,
    savingIpfsSettings: false,
    savingUserSettings: false
});

export const SettingsRecord = Record({
    geth: new GethSettings(),
    defaultGethSettings: new GethSettings(),
    ipfs: new IpfsSettings(),
    defaultIpfsSettings: new IpfsSettings(),
    flags: new Flags(),
    userSettings: new UserSettings(),
    general: new GeneralSettings(),
});

export default class SettingsStateModel extends SettingsRecord {
    getUserSettings = (state, record) => {
        const data = Object.assign({}, record);
        const preference = new PasswordPreference(data.passwordPreference);
        const hideComment = new HiddenContent(data.hideCommentContent);
        const hideEntry = new HiddenContent(data.hideEntryContent);
        const notifPreferences = new NotificationsPreference(data.notificationsPreference);
        if (!data.defaultLicense) {
            data.defaultLicense = state.getIn(['userSettings', 'defaultLicense']);
        }
        if (data.trustedDomains) {
            data.trustedDomains = new List(data.trustedDomains);
        }
        return new UserSettings(data).merge({
            hideCommentContent: hideComment,
            hideEntryContent: hideEntry,
            notificationsPreference: notifPreferences,
            passwordPreference: preference
        });
    }
    mergeUserSettings = (state, record) => {
        const data = Object.assign({}, record);
        const changes = {};
        if (data.passwordPreference) {
            changes.passwordPreference = new PasswordPreference(data.passwordPreference);
        }
        if (data.hideCommentContent) {
            changes.hideCommentContent = new HiddenContent(data.hideCommentContent);
        }
        if (data.hideEntryContent) {
            changes.hideEntryContent = new HiddenContent(data.hideEntryContent);
        }
        if (data.notificationsPreference) {
            changes.notificationsPreference = new NotificationsPreference(data.notificationsPreference);
        }
        if (data.trustedDomains) {
            changes.trustedDomains = new List(data.trustedDomains);
        }
        return state.get('userSettings').merge(data).merge(changes);
    };
}