import * as types from '../constants/SettingsConstants';
import { createReducer } from './create-reducer';
import { fromJS, Record } from 'immutable';

const GethSettings = Record({
    datadir: null,
    ipcpath: null,
    cache: null
});

const IpfsSettings = Record({
    ipfsPath: null
});

const UserSettings = Record ({

});

const initialState = fromJS({
    geth: new GethSettings(),
    ipfs: new IpfsSettings(),
    flags: {},
    userSettings: new UserSettings(),
    isAdvanced: false
});

const settingsState = createReducer(initialState, {
    [types.GET_SETTINGS_SUCCESS]: (state, action) =>
        state.merge({ [action.table]: fromJS(action.data[0]) }),

    [types.GET_SETTINGS_ERROR]: (state, action) =>
        state.merge({ [action.table]: { error: action.error } }),

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
