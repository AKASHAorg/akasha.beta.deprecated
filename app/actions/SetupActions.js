import * as types from '../constants/SetupConstants';

export function setupGeth (path) {
  return {type: types.SETUP_GETH, path};
}

export function setupIPFS (path) {
  return {type: types.SETUP_IPFS, path};
}

export function setGethIpc (path) {

  return {type: types.SET_GETH_IPC, path};
}

export function showAdvanced () {

  return {type: types.SHOW_ADVANCED};
}
