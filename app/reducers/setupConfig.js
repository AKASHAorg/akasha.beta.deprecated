import * as types from '../constants/SetupConstants';
import { Map, fromJS } from 'immutable';

const preferences = window.akasha.userPreferences.defaultConfig;

const initialState = Map({
    gethPath: preferences.gethPath,
    gethPathIpc: preferences.gethPathIpc,
    ipfsApiPath: preferences.ipfsApiPath,
    isInit: preferences.isInit,
    toggleAdvanced: false,
    gethStarted: false,
    gethMessage: null
});

export default function setupConfig (state = initialState, action) {
    switch (action.type) {
    case types.SETUP_GETH:
        return state.set('gethPath', action.path);
    case types.SET_GETH_IPC:
        return state.set('gethPathIpc', action.path);
    case types.SETUP_IPFS:
        return state.set('ipfsApiPath', action.path);
    case types.TOGGLE_ADVANCED:
        return state.set('toggleAdvanced', action.tick);
    case types.DEFAULT_OPTIONS:
        return state.merge({
            gethPath: preferences.gethPath,
            gethPathIpc: preferences.gethPathIpc,
            ipfsApiPath: preferences.ipfsApiPath
        });
    case types.SUBMIT_OPTIONS:
        {
            const finalState = state.set('isInit', true);
            const config = state.toObject();
            delete config.toggleAdvanced;
            window.akasha.userPreferences.setConfig(config);
            return finalState;
        }
    case types.GETH_START:
        return state.merge({
            gethStarted: true,
            gethMessage: action.data
        });
    case types.GETH_START_FAILED:
        return state.merge({
            gethStarted: false,
            gethMessage: action.data
        });
    default:
        return state;
    }
}
