/* eslint new-cap: ["error", { "capIsNewExceptions": ["Record"] }]*/
import { fromJS, Record, List } from 'immutable';
import * as types from '../constants';
import * as settingsTypes from '../constants/SettingsConstants';
import * as appTypes from '../constants/AppConstants';
import * as eProcTypes from '../constants';
import { createReducer } from './create-reducer';

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

const Ports = Record({
    apiPort: null,
    gatewayPort: null,
    swarmPort: null
});

const IpfsSettings = Record({
    ports: new Ports(),
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
    requestStartupChange: true,
    savingGethSettings: false,
    savingIpfsSettings: false
});

const initialState = fromJS({
    geth: new GethSettings(),
    defaultGethSettings: new GethSettings(),
    ipfs: new IpfsSettings(),
    defaultIpfsSettings: new IpfsSettings(),
    flags: new Flags(),
    userSettings: new UserSettings(),
    general: new GeneralSettings(),
    isAdvanced: false,
    fetchingFlags: false,
    fetchingGethSettings: false,
    fetchingIpfsSettings: false,
    generalSettingsPending: false,
    settingsPending: false
});

const settingsState = createReducer(initialState, {

    [types.GETH_SETTINGS]: state =>
        state.set('gethSettingsPending', true),

    [types.GETH_SETTINGS_SUCCESS]: (state, { data }) => {
        const defaultSettings = new GethSettings().toJS();
        const newSettings = {};
        Object.keys(data).forEach((key) => {
            if (key !== 'name' && data[key] !== defaultSettings[key]) {
                newSettings[key] = data[key];
            }
        });

        return state.merge({
            geth: state.get('geth').merge(newSettings),
            gethSettingsPending: false
        });
    },

    [types.GETH_SETTINGS_ERROR]: state =>
        state.merge({
            gethSettingsPending: false
        }),

    [types.IPFS_SETTINGS]: state =>
        state.set('ipfsSettingsPending', true),

    [types.IPFS_SETTINGS_SUCCESS]: (state, { data }) => {
        const defaultSettings = new IpfsSettings().toJS();
        const newSettings = {};
        Object.keys(data).forEach((key) => {
            if (key !== 'ports' && key !== 'name' && data[key] !== defaultSettings[key]) {
                newSettings[key] = data[key];
            }
        });

        return state.merge({
            ipfs: state.get('ipfs').merge(newSettings),
            ipfsSettingsPending: false
        });
    },

    [types.IPFS_SETTINGS_ERROR]: state =>
        state.merge({
            ipfsSettingsPending: false
        }),

    [types.GETH_SAVE_SETTINGS]: state =>
        state.merge({
            flags: state.get('flags').merge({ savingGethSettings: true })
        }),

    [types.GETH_SAVE_SETTINGS_SUCCESS]: (state, { data }) =>
        state.merge({
            flags: state.get('flags').merge({ savingGethSettings: false }),
            geth: state.get('geth').merge(data)
        }),

    [types.GETH_SAVE_SETTINGS_ERROR]: state =>
        state.merge({
            flags: state.get('flags').merge({ savingGethSettings: false })
        }),

    [types.IPFS_SAVE_SETTINGS]: state =>
        state.merge({
            flags: state.get('flags').merge({ savingIpfsSettings: true })
        }),

    [types.IPFS_SAVE_SETTINGS_SUCCESS]: (state, { data }) =>
        state.merge({
            flags: state.get('flags').merge({ savingIpfsSettings: false }),
            ipfs: state.get('ipfs').merge(data)
        }),

    [types.IPFS_SAVE_SETTINGS_ERROR]: state =>
        state.merge({
            flags: state.get('flags').merge({ savingIpfsSettings: false })
        }),

    [settingsTypes.GET_USER_SETTINGS_SUCCESS]: (state, { data }) =>
        state.merge({
            userSettings: data ? new UserSettings(data) : new UserSettings()
        }),

    [settingsTypes.CLEAN_USER_SETTINGS]: state =>
        state.set('userSettings', new UserSettings()),

    [settingsTypes.SAVE_LATEST_MENTION_SUCCESS]: (state, { data }) =>
        state.merge({
            userSettings: state.get('userSettings').merge({
                latestMention: data
            })
        }),

    [settingsTypes.SAVE_LATEST_MENTION_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error)),
        }),

    [settingsTypes.SAVE_PASSWORD_PREFERENCE_SUCCESS]: (state, { data }) => {
        const userSettings = state.get('userSettings').set('passwordPreference', data);
        return state.set('userSettings', userSettings);
    },

    [settingsTypes.CHANGE_THEME]: (state, action) => state.updateIn(['general', 'theme'], () => action.theme),

    [types.GENERAL_SETTINGS]: state =>
        state.set('generalSettingsPending', true),

    [types.GENERAL_SETTINGS_SUCCESS]: (state, { data }) =>
        state.merge({
            general: new GeneralSettings(data),
            generalSettingsPending: false
        }),

    [types.GENERAL_SETTINGS_ERROR]: state =>
        state.merge({
            generalSettingsPending: false
        }),

    [types.GENERAL_SETTINGS_SAVE_SUCCESS]: (state, { data }) =>
        state.merge({
            general: state.get('general').merge(data)
        }),

    [eProcTypes.GETH_GET_OPTIONS_SUCCESS]: (state, action) => {
        const gethSettings = Object.assign({}, state.get('geth').toJS());
        const initialSettings = new GethSettings().toJS();

        Object.keys(gethSettings).forEach((key) => {
            if (gethSettings[key] === initialSettings[key]) {
                gethSettings[key] = action.data[key];
            }
        });

        return state.merge({
            geth: new GethSettings(gethSettings),
            defaultGethSettings: new GethSettings(action.data)
        });
    },

    [eProcTypes.IPFS_GET_CONFIG_SUCCESS]: (state, action) => {
        const ipfsSettings = Object.assign({}, state.get('ipfs').toJS());
        if (ipfsSettings.ports) {
            delete ipfsSettings.ports;
        }
        const initialSettings = new IpfsSettings().toJS();

        Object.keys(ipfsSettings).forEach((key) => {
            if (key !== 'ports' && ipfsSettings[key] === initialSettings[key]) {
                ipfsSettings[key] = action.data[key];
            }
        });

        return state.merge({
            ipfs: new IpfsSettings(ipfsSettings),
            defaultIpfsSettings: new IpfsSettings(action.data)
        });
    },

    [eProcTypes.IPFS_GET_PORTS_SUCCESS]: (state, action) => {
        const ports = {
            apiPort: Number(action.data.apiPort),
            gatewayPort: Number(action.data.gatewayPort),
            swarmPort: Number(action.data.swarmPort)
        };
        return state.merge({
            ipfs: state.get('ipfs').merge({
                ports: new Ports(ports)
            })
        });
    },

    [eProcTypes.IPFS_RESET_PORTS]: state =>
        state.merge({
            ipfs: state.get('ipfs').merge({
                ports: new Ports()
            })
        }),

    [appTypes.CLEAN_STORE]: state =>
        state.merge({
            userSettings: new UserSettings()
        }),
});

export default settingsState;
