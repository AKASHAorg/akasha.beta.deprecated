/* eslint new-cap: ["error", { "capIsNewExceptions": ["Map"] }] */
import * as types from '../constants/SetupConstants';
import { createReducer } from './create-reducer';
import { Map } from 'immutable';

const initialState = Map({
    geth: Map({
        datadir: '',
        ipcpath: '',
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

const setupConfig = createReducer(initialState, {
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

export default setupConfig;
