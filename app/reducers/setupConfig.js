import {SETUP_GETH, SET_GETH_IPC, SETUP_IPFS, TOGGLE_ADVANCED} from '../constants/SetupConstants';
import { Map } from 'immutable';

const remote      = require('electron').remote;
const preferences = remote.getGlobal('userPreferences');

const initialState = Map({
  gethPath:       preferences.gethPath,
  gethPathIpc:    preferences.gethPathIpc,
  ipfsApiPath:    preferences.ipfsApiPath,
  toggleAdvanced: false
});

export default function setupConfig (state = initialState, action) {

  console.log(action);

  switch (action.type) {
    case SETUP_GETH:
      if (!action.path) {
        action.path = initialState.get('gethPath');
      }
      return state.set('gethPath', action.path);
    case SET_GETH_IPC:
      if (!action.path) {
        action.path = initialState.get('gethPathIpc');
      }
      return state.set('gethPathIpc', action.path);
    case SETUP_IPFS:
      if (!action.path) {
        action.path = initialState.get('ipfsApiPath');
      }
      return state.set('ipfsApiPath', action.path);
    case TOGGLE_ADVANCED:
      return state.set('toggleAdvanced', action.tick);
    default:
      return state;
  }
}
