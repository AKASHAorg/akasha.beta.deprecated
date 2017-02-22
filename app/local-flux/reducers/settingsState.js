/* eslint new-cap: ["error", { "capIsNewExceptions": ["Record"] }]*/
import { fromJS, Record, List } from 'immutable';
import * as types from '../constants/SettingsConstants';
import * as appTypes from '../constants/AppConstants';
import * as eProcTypes from '../constants/external-process-constants';
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
    theme: 'light'
});

const Flags = Record({
    requestStartupChange: true
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
    generalSettingsPending: false
});

const settingsState = createReducer(initialState, {
    [types.GET_SETTINGS_SUCCESS]: (state, action) => {
        let data = {};
        if (action.table === 'geth') {
            const initialSettings = new GethSettings().toJS();

            Object.keys(action.data).forEach((key) => {
                if (key !== 'name' && action.data[key] !== initialSettings[key]) {
                    data[key] = action.data[key];
                }
            });

            return state.merge({
                geth: state.get('geth').merge(data)
            });
        } else if (action.table === 'ipfs') {
            const initialSettings = new IpfsSettings().toJS();

            Object.keys(action.data).forEach((key) => {
                if (key !== 'name' && action.data[key] !== initialSettings[key]) {
                    data[key] = action.data[key];
                }
            });

            return state.merge({
                ipfs: state.get('ipfs').merge(data)
            });
        } else if (action.table === 'flags') {
            data = new Flags(action.data);
        } else if (action.table === 'general') {
            data = new GeneralSettings(action.data);
        }
        return state.merge({ [action.table]: data });
    },

    [types.GET_SETTINGS_ERROR]: (state, action) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(action.error))
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

    [types.START_FETCHING_SETTINGS]: (state, action) => {
        if (action.table === 'geth') {
            return state.merge({
                fetchingGethSettings: true
            });
        } else if (action.table === 'ipfs') {
            return state.merge({
                fetchingIpfsSettings: true
            });
        } else if (action.table === 'flags') {
            return state.merge({
                fetchingFlags: true
            });
        }
        return state;
    },

    [types.FINISH_FETCHING_SETTINGS]: (state, action) => {
        if (action.table === 'geth') {
            return state.merge({
                fetchingGethSettings: false
            });
        } else if (action.table === 'ipfs') {
            return state.merge({
                fetchingIpfsSettings: false
            });
        } else if (action.table === 'flags') {
            return state.merge({
                fetchingFlags: false
            });
        }
        return state;
    },

    [types.GET_USER_SETTINGS_SUCCESS]: (state, { data }) => {
        return state.merge({
            userSettings: data ? new UserSettings(data) : new UserSettings()
        });
    },

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

    [types.GENERAL_SETTINGS_REQUEST]: state =>
        state.set('generalSettingsPending', true),

    [types.GENERAL_SETTINGS_SUCCESS]: (state, { data }) =>
        state.merge({
            generalSettings: new GeneralSettings(data),
            generalSettingsPending: false
        }),

    [types.GENERAL_SETTINGS_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error)),
            generalSettingsPending: false
        }),

    [eProcTypes.GET_GETH_OPTIONS_SUCCESS]: (state, action) => {
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

    [eProcTypes.GET_IPFS_CONFIG_SUCCESS]: (state, action) => {
        const ipfsSettings = Object.assign({}, state.get('ipfs').toJS());
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

    [eProcTypes.GET_IPFS_PORTS_SUCCESS]: (state, action) => {
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

    [eProcTypes.RESET_IPFS_PORTS]: state =>
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
