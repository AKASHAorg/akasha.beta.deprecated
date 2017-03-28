import { Record } from 'immutable';

const GethSettings = Record({
    autodag: null,
    cache: null,
    datadir: null,
    fast: null,
    ipcpath: null,
    mine: null,
    minerthreads: null,
    networkid: null
});

const PortsRecord = Record({
    apiPort: null,
    gatewayPort: null,
    swarmPort: null
});

const IpfsSettings = Record({
    ports: new PortsRecord(),
    storagePath: null,
});

const Notifications = Record({
    muted: []
});

const PasswordPreference = Record({
    remember: false,
    time: null
});

const UserSettings = Record({
    akashaId: null,
    lastBlockNr: null,
    latestMention: null,
    defaultLicence: null,
    notifications: new Notifications(),
    passwordPreference: new PasswordPreference()
});

const GeneralSettings = Record({
    theme: 'light',
    configurationSaved: false
});

const Flags = Record({
    generalSettingsPending: false,
    savingGethSettings: false,
    savingIpfsSettings: false
});

const SettingsRecord = Record({
    geth: new GethSettings(),
    defaultGethSettings: new GethSettings(),
    ipfs: new IpfsSettings(),
    defaultIpfsSettings: new IpfsSettings(),
    flags: new Flags(),
    userSettings: new UserSettings(),
    general: new GeneralSettings(),
});

export default SettingsRecord;
export { GeneralSettings, GethSettings, IpfsSettings, PortsRecord, UserSettings };
