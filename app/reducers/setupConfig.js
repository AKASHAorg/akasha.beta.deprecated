/* eslint new-cap: ["error", { "capIsNewExceptions": ["Map"] }] */
import * as setupActions from '../actions/SetupActions';
import * as types from '../constants/SetupConstants';
import { Map } from 'immutable';

const initialState = Map({
    geth: Map({
        dataDir: '',
        ipcPath: '',
        status: '',
        cacheSize: '',
        started: false,
    }),
    ipfs: Map({
        apiPort: '',
        gatewayPort: '',
        started: false,
        status: ''
    }),
    currentStep: 1,
    isAdvanced: false
});

export default function setupConfig (state = initialState, action) {
    switch (action.type) {
    case types.SETUP_ADVANCED_SETTINGS:
        return state.set('isAdvanced', action.isAdvanced);
    case types.SETUP_GETH_DATADIR:
        return state.updateIn(['geth', 'dataDir'], () => action.path);
    case types.SETUP_GETH_IPCPATH:
        return state.updateIn(['geth', 'ipcPath'], () => action.path);
    case types.SETUP_GETH_CACHE_SIZE:
        return state.updateIn(['geth', 'cacheSize'], () => action.size);
    case types.SETUP_IPFS_API_PORT:
        return state.updateIn(['ipfs', 'apiPort'], () => action.port);
    case types.SETUP_IPFS_GATEWAY_PORT:
        return state.updateIn(['ipfs', 'gatewayPort'], () => action.port);
    case types.START_GETH_SUCCESS:
        return state.mergeIn(['geth'], {
            started: true,
            dataDir: action.data.dataDir,
            ipcPath: action.data.ipcPath,
            status: action.data.status
        });
    case types.START_GETH_ERROR:
        return state.mergeIn(['geth'], {
            started: false,
            status: action.data.status
        });
    case types.STOP_GETH_SUCCESS:
        return state.mergeIn(['geth'], {
            started: false,
            status: action.data.status,
        });
    case types.STOP_GETH_ERROR:
        return state.mergeIn(['geth'], {
            started: true,
            status: action.data.status
        });
    case types.RETRY_SETUP:
        return state.mergeDeep({
            geth: {
                status: ''
            },
            ipfs: {
                status: ''
            },
            isAdvanced: action.isAdvanced
        });
    default:
        return state;
    }
}
