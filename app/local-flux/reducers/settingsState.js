import * as types from '../constants';
import { createReducer } from './utils';
import SettingsStateModel, {
    GeneralSettings,
    GethSettings,
    IpfsSettings,
    PortsRecord,
    UserSettings
} from './state-models/settings-state-model';
import { IPFS_MODULE } from '@akashaproject/common/constants';

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

    [types.IPFS_SETTINGS_SUCCESS]: (state, { payload }) => {
        const defaultSettings = new IpfsSettings().toJS();
        const newSettings = {};
        Object.keys(payload).forEach(key => {
            if (key !== 'ports' && key !== 'name' && payload[key] !== defaultSettings[key]) {
                newSettings[key] = payload[key];
            }
        });

        return state.merge({
            ipfs: state.get('ipfs').merge(newSettings)
        });
    },

    [types.GETH_SAVE_SETTINGS_SUCCESS]: (state, { payload }) =>
        state.merge({
            geth: state.get('geth').merge(payload)
        }),

    [types.IPFS_SAVE_SETTINGS_SUCCESS]: (state, { payload }) =>
        state.merge({
            ipfs: state.get('ipfs').merge(payload)
        }),

    [types.GET_APP_SETTINGS_SUCCESS]: (state, { payload }) =>
        state.merge({
            general: new GeneralSettings(payload)
        }),

    [types.GET_APP_SETTINGS_ERROR]: (state, { payload }) => state,

    [types.GENERAL_SETTINGS_SAVE_SUCCESS]: (state, { payload }) =>
        state.merge({
            general: state.get('general').merge(payload)
        }),

    [`${ IPFS_MODULE.getConfig }_SUCCESS`]: (state, { payload }) => {
        const ipfsSettings = Object.assign({}, state.get('ipfs').toJS());
        if (ipfsSettings.ports) {
            delete ipfsSettings.ports;
        }
        const initialSettings = new IpfsSettings().toJS();

        Object.keys(ipfsSettings).forEach(key => {
            if (key !== 'ports' && ipfsSettings[key] === initialSettings[key]) {
                ipfsSettings[key] = payload[key];
            }
        });

        return state.merge({
            ipfs: new IpfsSettings(ipfsSettings),
            defaultIpfsSettings: new IpfsSettings({ payload })
        });
    },

    [`${ IPFS_MODULE.getPorts }_SUCCESS`]: (state, { payload }) => {
        const ports = {
            apiPort: Number(payload.apiPort),
            gatewayPort: Number(payload.gatewayPort),
            swarmPort: Number(payload.swarmPort)
        };
        return state.merge({
            ipfs: state.get('ipfs').merge({
                ports: new PortsRecord(ports)
            })
        });
    },

    [types.USER_SETTINGS_SAVE_SUCCESS]: (state, { payload }) =>
        state.merge({
            flags: state.get('flags').set('savingUserSettings', false),
            userSettings: state.mergeUserSettings(state, payload)
        }),

    [types.PROFILE_LOGOUT_SUCCESS]: state => state.set('userSettings', new UserSettings()),

    [types.USER_SETTINGS_SUCCESS]: (state, { payload }) =>
        state.set('userSettings', state.createUserSettingsRecord(state, payload)),

    [types.USER_SETTINGS_ADD_TRUSTED_DOMAIN_SUCCESS]: (state, { payload }) =>
        state.merge({
            userSettings: state.mergeUserSettings(state, payload)
        })
});

export default settingsState;
