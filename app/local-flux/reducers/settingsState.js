import * as types from '../constants';
import { createReducer } from './utils';
import SettingsStateModel, {
    GeneralSettings,
    GethSettings,
    IpfsSettings,
    PortsRecord,
    UserSettings
} from './state-models/settings-state-model';
import { GETH_MODULE, IPFS_MODULE } from '@akashaproject/common/constants';

const initialState = new SettingsStateModel();

const settingsState = createReducer(initialState, {
    [types.GETH_SETTINGS_SUCCESS]: (state, { payload }) => {
        const defaultSettings = new GethSettings().toJS();
        const newSettings = {};
        Object.keys(payload).forEach(key => {
            if (key !== 'name' && payload[key] !== defaultSettings[key]) {
                newSettings[key] = payload[key];
            }
        });

        return state.merge({
            geth: state.get('geth').merge(newSettings)
        });
    },

    [types.IPFS_SETTINGS_SUCCESS]: (state, { data }) => {
        const defaultSettings = new IpfsSettings().toJS();
        const newSettings = {};
        Object.keys(data).forEach(key => {
            if (key !== 'ports' && key !== 'name' && data[key] !== defaultSettings[key]) {
                newSettings[key] = data[key];
            }
        });

        return state.merge({
            ipfs: state.get('ipfs').merge(newSettings)
        });
    },

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

    // [types.SAVE_LATEST_MENTION_SUCCESS]: (state, { data }) =>
    //     state.merge({
    //         userSettings: state.get('userSettings').merge({
    //             latestMention: data
    //         })
    //     }),

    // [types.SAVE_LATEST_MENTION_ERROR]: (state, { error }) =>
    //     state.merge({
    //         errors: state.get('errors').push(new ErrorRecord(error)),
    //     }),

    // [types.CHANGE_THEME]: (state, action) => state.updateIn(['general', 'theme'], () => action.theme),

    [types.GENERAL_SETTINGS]: state => state.setIn(['flags', 'generalSettingsPending'], true),

    [types.GENERAL_SETTINGS_SUCCESS]: (state, { data }) =>
        state.merge({
            general: new GeneralSettings(data),
            flags: state.get('flags').set('generalSettingsPending', false)
        }),

    [types.GENERAL_SETTINGS_ERROR]: state => state.setIn(['flags', 'generalSettingsPending'], false),

    [types.GENERAL_SETTINGS_SAVE_SUCCESS]: (state, { data }) =>
        state.merge({
            general: state.get('general').merge(data)
        }),

    // [types.GETH_GET_OPTIONS_SUCCESS]: (state, action) => {
    //     const gethSettings = Object.assign({}, state.get('geth').toJS());
    //     const initialSettings = new GethSettings().toJS();

    //     Object.keys(gethSettings).forEach((key) => {
    //         if (gethSettings[key] === initialSettings[key]) {
    //             gethSettings[key] = action.data[key];
    //         }
    //     });

    //     if (!action.data.syncmode) {
    //         gethSettings.syncmode = initialSettings.syncmode;
    //     }

    //     return state.merge({
    //         geth: new GethSettings(gethSettings),
    //         defaultGethSettings: new GethSettings(action.data)
    //     });
    // },

    [`${IPFS_MODULE.getConfig}_SUCCESS`]: (state, action) => {
        const ipfsSettings = Object.assign({}, state.get('ipfs').toJS());
        if (ipfsSettings.ports) {
            delete ipfsSettings.ports;
        }
        const initialSettings = new IpfsSettings().toJS();

        Object.keys(ipfsSettings).forEach(key => {
            if (key !== 'ports' && ipfsSettings[key] === initialSettings[key]) {
                ipfsSettings[key] = action.data[key];
            }
        });

        return state.merge({
            ipfs: new IpfsSettings(ipfsSettings),
            defaultIpfsSettings: new IpfsSettings(action.data)
        });
    },

    [`${IPFS_MODULE.getPorts}_SUCCESS`]: (state, { data }) => {
        const ports = {
            apiPort: Number(data.apiPort),
            gatewayPort: Number(data.gatewayPort),
            swarmPort: Number(data.swarmPort)
        };
        return state.merge({
            ipfs: state.get('ipfs').merge({
                ports: new PortsRecord(ports)
            })
        });
    },

    // [types.IPFS_RESET_PORTS]: state =>
    //     state.merge({
    //         ipfs: state.get('ipfs').merge({
    //             ports: new PortsRecord()
    //         })
    //     }),

    [types.PROFILE_LOGOUT_SUCCESS]: state => state.set('userSettings', new UserSettings()),

    [types.USER_SETTINGS_SUCCESS]: (state, { data }) =>
        state.set('userSettings', state.createUserSettingsRecord(state, data)),

    [types.USER_SETTINGS_SAVE]: state => state.setIn(['flags', 'savingUserSettings'], true),

    [types.USER_SETTINGS_SAVE_ERROR]: state => state.setIn(['flags', 'savingUserSettings'], false),

    [types.USER_SETTINGS_SAVE_SUCCESS]: (state, { data }) =>
        state.merge({
            flags: state.get('flags').set('savingUserSettings', false),
            userSettings: state.mergeUserSettings(state, data)
        }),

    [types.USER_SETTINGS_ADD_TRUSTED_DOMAIN_SUCCESS]: (state, { data }) =>
        state.merge({
            userSettings: state.mergeUserSettings(state, data)
        })
});

export default settingsState;
