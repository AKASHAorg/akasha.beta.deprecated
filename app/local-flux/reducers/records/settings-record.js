import { Record } from 'immutable';

export const GethSettings = Record({
    autodag: null,
    cache: null,
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

const Notifications = Record({
    muted: []
});

export const PasswordPreference = Record({
    remember: false,
    time: null
});

export const UserSettings = Record({
    ethAddress: null,
    lastBlockNr: null,
    latestMention: null,
    defaultLicense: null,
    notifications: new Notifications(),
    passwordPreference: new PasswordPreference()
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
