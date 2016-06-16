/* eslint new-cap: ["error", { "capIsNewExceptions": ["Map"] }] */
import * as types from '../constants/SetupConstants';
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
            return state.updateIn(['geth', 'cache'], () => action.size);
        case types.SETUP_IPFS_PATH:
            return state.updateIn(['ipfs', 'ipfsPath'], () => action.path);
        case types.SETUP_IPFS_API_PORT:
            return state.updateIn(['ipfs', 'apiPort'], () => action.port);
        case types.SETUP_IPFS_GATEWAY_PORT:
            return state.updateIn(['ipfs', 'gatewayPort'], () => action.port);
        case types.START_GETH_SUCCESS:
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
