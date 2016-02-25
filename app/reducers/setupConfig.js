import {SETUP_GETH, SET_GETH_IPC, SETUP_IPFS} from '../constants/SetupConstants';
import { Map } from 'immutable';

const initialState = Map({
  gethPath:    'a/b',
  gethPathIpc: 'a/b/geth.ipc',
  ipfsApiPath: 'ipfs/v1/etc'
});

export default function setupConfig (state = initialState, action) {

  switch (action.type) {
    case SETUP_GETH:
      return state.set('gethPath', action.path);
    case SET_GETH_IPC:
      return state.set('gethPathIpc', action.path);
    case SETUP_IPFS:
      return state.set('ipfsApiPath', action.path);
    default:
      return state;
  }
}
