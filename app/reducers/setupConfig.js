import {SETUP_GETH, SET_GETH_IPC, SETUP_IPFS, SHOW_ADVANCED} from '../constants/SetupConstants';
import { Map } from 'immutable';

const remote      = require('electron').remote;
const preferences = remote.getGlobal('userPreferences');

const initialState = Map({
  gethPath:     preferences.gethPath,
  gethPathIpc:  preferences.gethPathIpc,
  ipfsApiPath:  preferences.ipfsApiPath,
  showAdvanced: false
});

export default function setupConfig (state = initialState, action) {

  console.log(action);

  switch (action.type) {
    case SETUP_GETH:
      return state.set('gethPath', action.payload);
    case SET_GETH_IPC:
      return state.set('gethPathIpc', action.payload);
    case SETUP_IPFS:
      return state.set('ipfsApiPath', action.payload);
    case SHOW_ADVANCED:
      return state.set('showAdvanced', !state.get('showAdvanced'));
    default:
      return state;
  }
}
