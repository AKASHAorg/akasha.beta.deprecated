/* eslint new-cap: ["error", { "capIsNewExceptions": ["Record"] }]*/
import { fromJS, Record, List } from 'immutable';
import * as types from '../constants/SettingsConstants';
import * as appTypes from '../constants/AppConstants';
import * as eProcTypes from '../constants';
import { createReducer } from './create-reducer';

const ErrorRecord = Record({
    code: null,
    fatal: false,
    message: ''
});

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
    errors: new List(),
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

    [types.GETH_SETTINGS_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error)),
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

    [types.IPFS_SETTINGS_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error)),
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

    [types.SAVE_SETTINGS_SUCCESS]: (state, action) => {
        switch (action.table) {
            case 'geth':
                return state.merge({
                    geth: state.get('geth').merge(action.settings)
                });
            case 'ipfs':
                return state.merge({
                    ipfs: state.get('ipfs').merge(action.settings)
                });
            case 'userSettings':
                return state.merge({ userSettings: new UserSettings(action.settings) });
            case 'flags': {
                return state.merge({ flags: action.settings });
            }
            case 'general': {
                return state.updateIn(['general', 'theme'], () => action.settings.theme);
            }
            default:
                return state;
        }
    },

    [types.SAVE_SETTINGS_ERROR]: (state, action) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(action.error))
        }),

    [types.SETUP_ADVANCED_SETTINGS]: (state, action) =>
        state.set('isAdvanced', action.isAdvanced),

    [types.SETUP_GETH_DATADIR]: (state, action) =>
        state.updateIn(['geth', 'datadir'], () => action.path),

    [types.SETUP_GETH_IPCPATH]: (state, action) =>
        state.updateIn(['geth', 'ipcpath'], () => action.path),

    [types.SETUP_GETH_CACHE_SIZE]: (state, action) =>
        state.updateIn(['geth', 'cache'], () => action.size),

    [types.SETUP_IPFS_PATH]: (state, action) =>
        state.merge({
            ipfs: state.get('ipfs').merge({ storagePath: action.storagePath })
        }),

    [types.SETUP_IPFS_GATEWAY_PORT]: (state, action) =>
        state.updateIn(['ipfs', 'gatewayPort'], () => action.port),

    [types.RESET_SETTINGS]: state =>
        state.merge({
            geth: state.get('defaultGethSettings'),
            ipfs: state.get('defaultIpfsSettings')
        }),

    [types.GET_USER_SETTINGS_SUCCESS]: (state, { data }) =>
        state.merge({
            userSettings: data ? new UserSettings(data) : new UserSettings()
        }),

    [types.GET_USER_SETTINGS_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error)),
        }),

    [types.CLEAN_USER_SETTINGS]: state =>
        state.set('userSettings', new UserSettings()),

    [types.SAVE_LATEST_MENTION_SUCCESS]: (state, { data }) =>
        state.merge({
            userSettings: state.get('userSettings').merge({
                latestMention: data
            })
        }),

    [types.SAVE_LATEST_MENTION_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error)),
        }),

    [types.SAVE_PASSWORD_PREFERENCE_SUCCESS]: (state, { data }) => {
        const userSettings = state.get('userSettings').set('passwordPreference', data);
        return state.set('userSettings', userSettings);
    },

    [types.SAVE_PASSWORD_PREFERENCE_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
        }),

    [types.CHANGE_THEME]: (state, action) => state.updateIn(['general', 'theme'], () => action.theme),

    [types.GENERAL_SETTINGS]: state =>
        state.set('generalSettingsPending', true),

    [types.GENERAL_SETTINGS_SUCCESS]: (state, { data }) =>
        state.merge({
            general: new GeneralSettings(data),
            generalSettingsPending: false
        }),

    [types.GENERAL_SETTINGS_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error)),
            generalSettingsPending: false
        }),


    [types.GENERAL_SETTINGS_SAVE_SUCCESS]: (state, { data }) =>
        state.merge({
            general: state.get('general').merge(data)
        }),

    [types.GENERAL_SETTINGS_SAVE_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
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
