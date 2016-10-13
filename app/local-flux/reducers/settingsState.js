/* eslint new-cap: ["error", { "capIsNewExceptions": ["Record"] }]*/
import { fromJS, Record, List } from 'immutable';
import * as types from '../constants/SettingsConstants';
import { createReducer } from './create-reducer';

const ErrorRecord = Record({
    code: null,
    fatal: false,
    message: ''
});

const GethSettings = Record({
    datadir: '',
    ipcpath: '',
    cache: '',
});

const IpfsSettings = Record({
    ipfsPath: '',
});

const UserSettings = Record({

});

const initialState = fromJS({
    geth: new GethSettings(),
    ipfs: new IpfsSettings(),
    flags: {
        requestStartupChange: false
    },
    errors: new List(),
    userSettings: new UserSettings(),
    isAdvanced: false
});

const settingsState = createReducer(initialState, {
    [types.GET_SETTINGS_SUCCESS]: (state, action) => {
        let data;
        if (action.table === 'geth') {
            data = new GethSettings(action.data[0]);
        } else if (action.table === 'ipfs') {
            data = new IpfsSettings(action.data[0]);
        } else if (action.table === 'flags') {
            data = action.data[0];
        }
        return state.merge({ [action.table]: data });
    },

    [types.GET_SETTINGS_ERROR]: (state, action) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(action.error))
        }),

    [types.SAVE_SETTINGS_SUCCESS]: (state, action) => {
        console.log('save settings action', action);
        switch (action.table) {
            case 'geth':
                return state.merge({ geth: new GethSettings(action.data) });
            case 'ipfs':
                return state.merge({ ipfs: new IpfsSettings(action.data) });
            case 'userSettings':
                return state.merge({ userSettings: new UserSettings(action.data) });
            case 'flags': {
                return state.merge({ flags: action.settings });
            }
            default:
                return state;
        }
    },
    [types.SAVE_SETTINGS_ERROR]: (state, action) => {
        console.log('save settings error', action);
        return state.merge({
            errors: state.get('errors').push(new ErrorRecord(action.error))
        });
    },
    [types.SETUP_ADVANCED_SETTINGS]: (state, action) =>
        state.set('isAdvanced', action.isAdvanced),

    [types.SETUP_GETH_DATADIR]: (state, action) =>
        state.updateIn(['geth', 'datadir'], () => action.path),

    [types.SETUP_GETH_IPCPATH]: (state, action) =>
        state.updateIn(['geth', 'ipcpath'], () => action.path),

    [types.SETUP_GETH_CACHE_SIZE]: (state, action) =>
        state.updateIn(['geth', 'cache'], () => action.size),

    [types.SETUP_IPFS_PATH]: (state, action) =>
        state.updateIn(['ipfs', 'ipfsPath'], () => action.path),

    [types.SETUP_IPFS_API_PORT]: (state, action) =>
        state.updateIn(['ipfs', 'apiPort'], () => action.port),

    [types.SETUP_IPFS_GATEWAY_PORT]: (state, action) =>
        state.updateIn(['ipfs', 'gatewayPort'], () => action.port),
});

export default settingsState;
