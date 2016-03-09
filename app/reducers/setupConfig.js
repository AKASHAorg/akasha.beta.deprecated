import {SETUP_GETH, SET_GETH_IPC, SETUP_IPFS, TOGGLE_ADVANCED,
  DEFAULT_OPTIONS, SUBMIT_OPTIONS} from '../constants/SetupConstants';
import { Map } from 'immutable';

const remote          = require('electron').remote;
const userPreferences = remote.getGlobal('userPreferences');

const preferences = userPreferences.defaultConfig;

const initialState = Map({
  gethPath:       preferences.gethPath,
  gethPathIpc:    preferences.gethPathIpc,
  ipfsApiPath:    preferences.ipfsApiPath,
  isInit:         preferences.isInit,
  toggleAdvanced: false
});

export default function setupConfig (state = initialState, action) {

  switch (action.type) {
    case SETUP_GETH:
      return state.set('gethPath', action.path);
    case SET_GETH_IPC:
      return state.set('gethPathIpc', action.path);
    case SETUP_IPFS:
      return state.set('ipfsApiPath', action.path);
    case TOGGLE_ADVANCED:
      return state.set('toggleAdvanced', action.tick);
    case DEFAULT_OPTIONS:
      return state.merge({
        gethPath:    preferences.gethPath,
        gethPathIpc: preferences.gethPathIpc,
        ipfsApiPath: preferences.ipfsApiPath
      });
    case SUBMIT_OPTIONS:
      const finalState = state.set('isInit', true);
      const config     = state.toObject();

      delete config.toggleAdvanced;
      userPreferences.setConfig(config);

      return finalState;
    default:
      return state;
  }
}
