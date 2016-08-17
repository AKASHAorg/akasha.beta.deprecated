/* eslint new-cap: ["error", { "capIsNewExceptions": ["Map"] }] */
import * as types from '../constants/SetupConstants';
import { createReducer } from './create-reducer';
import { Map } from 'immutable';

const initialState = Map({
    geth: Map({
        dataDir: '',
        ipcPath: '',
        status: '',
        cache: '',
        started: false,
    }),
    ipfs: Map({
        apiPort: '',
        gatewayPort: '',
        ipfsPath: '',
        started: false,
        status: ''
    }),
    flags: {},
    currentStep: 1,
    isAdvanced: false
});

const setupConfig =  createReducer(initialState, {
    [types.SETUP_ADVANCED_SETTINGS]: (state, action) => {
        return state.set('isAdvanced', action.isAdvanced);
    },
    [types.SETUP_GETH_DATADIR]: (state, action) => {
        return state.updateIn(['geth', 'dataDir'], () => action.path);
    },
    [types.SETUP_GETH_IPCPATH]: (state, action) => {
        return state.updateIn(['geth', 'ipcPath'], () => action.path);
    },
    [types.SETUP_GETH_CACHE_SIZE]: (state, action) => {
        return state.updateIn(['geth', 'cache'], () => action.size);
    },
    [types.SETUP_IPFS_PATH]: (state, action) => {
        return state.updateIn(['ipfs', 'ipfsPath'], () => action.path);
    },
    [types.SETUP_IPFS_API_PORT]: (state, action) => {
        return state.updateIn(['ipfs', 'apiPort'], () => action.port);
    },
    [types.SETUP_IPFS_GATEWAY_PORT]: (state, action) => {
        return state.updateIn(['ipfs', 'gatewayPort'], () => action.port);
    },
    [types.START_GETH_SUCCESS]: (state, action) => {
        if (action.data.status) {
            return state.mergeIn(['geth'], {
                started: true,
                dataDir: action.data.status.dataDir,
                ipcPath: action.data.status.ipcPath,
                cache: action.data.status.cache,
                status: action.data.status
            });
        }
        return state.mergeIn(['geth'], {
            started: true
        });
    },
    [types.START_GETH_ERROR]: (state, action) => {
        return state.mergeIn(['geth'], {
            started: false,
            status: action.data.status
        });
    },
    [types.STOP_GETH_SUCCESS]: (state, action) => {
        return state.mergeIn(['geth'], {
            started: false,
            status: action.data.status,
        });
    },
    [types.STOP_GETH_ERROR]: (state, action) => {
        return state.mergeIn(['geth'], {
            started: true,
            status: action.data.status
        });
    },
    [types.RETRY_SETUP]: (state, action) => {
        return state.mergeDeep({
            geth: {
                status: ''
            },
            ipfs: {
                status: ''
            },
            isAdvanced: action.isAdvanced
        });
    }
});

export default setupConfig;
