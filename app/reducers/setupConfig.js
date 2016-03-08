import {SETUP_GETH, SET_GETH_IPC, SETUP_IPFS, TOGGLE_ADVANCED, DEFAULT_OPTIONS} from '../constants/SetupConstants';
import { Map } from 'immutable';

const remote      = require('electron').remote;
const preferences = remote.getGlobal('userPreferences').defaultConfig;

const initialState = Map({
  gethPath:       preferences.gethPath,
  gethPathIpc:    preferences.gethPathIpc,
  ipfsApiPath:    preferences.ipfsApiPath,
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
    default:
      return state;
  }
}
