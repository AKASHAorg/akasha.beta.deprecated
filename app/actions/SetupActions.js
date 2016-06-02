import { startGethService } from '../services/setup-service';
import * as types from '../constants/SetupConstants';

export function startGeth (options) {
    return dispatch => {
        startGethService(options).then(data => {
            if (!data.success) {
                dispatch({ type: types.START_GETH_FAILURE, data });
            }
            dispatch({ type: types.START_GETH, data });
        }).catch(reason => {
            dispatch({ type: types.START_GETH_FAILURE, reason });
        });
    };
}

export function setupGeth (path) {
  return { type: types.SETUP_GETH, path };
}

export function setupIPFS (path) {
  return { type: types.SETUP_IPFS, path };
}

export function setGethIpc (path) {
  return { type: types.SET_GETH_IPC, path };
}

export function toggleAdvanced (tick) {
  return { type: types.TOGGLE_ADVANCED, tick };
}

export function defaultOptions () {
  return { type: types.DEFAULT_OPTIONS };
}

export function submitOptions () {
  return { type: types.SUBMIT_OPTIONS };
}
