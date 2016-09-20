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
    [types.GET_SETTINGS_SUCCESS]: (state, action) => {
        return state.merge({ [action.table]: fromJS(action.data[0]) });
    },
    [types.GET_SETTINGS_ERROR]: (state, action) => {
        return state.merge({ [action.table]: { error: action.error }});
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

    [types.START_GETH_SUCCESS]: (state, action) => {
        if (action.data.status) {
            return state.mergeIn(['geth'], {
                started: true,
                datadir: action.data.status.datadir,
                ipcpath: action.data.status.ipcpath,
                cache: action.data.status.cache,
                status: action.data.status
            });
        }
        return state.mergeIn(['geth'], {
            started: true
        });
    },
    [types.START_GETH_ERROR]: (state, action) =>
        state.mergeIn(['geth'], {
            started: false,
            status: action.data.status
        }),

    [types.STOP_GETH_SUCCESS]: (state, action) =>
        state.mergeIn(['geth'], {
            started: false,
            status: action.data.status,
        }),

    [types.STOP_GETH_ERROR]: (state, action) =>
        state.mergeIn(['geth'], {
            started: true,
            status: action.data.status
        }),

    [types.RETRY_SETUP]: (state, action) =>
        state.mergeDeep({
            geth: {
                status: ''
            },
            ipfs: {
                status: ''
            },
            isAdvanced: action.isAdvanced
        }),
});

export default settingsState;
