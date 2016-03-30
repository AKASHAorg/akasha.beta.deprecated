import * as types from '../constants/ProfileConstants';
const remote = require('electron').remote;
const gethInstance = remote.getGlobal('gethInstance');

export function updateName(text) {
  return { type: types.UPDATE_NAME, text };
}

export function updateUser(text) {
  return { type: types.UPDATE_USER, text };
}

export function updatePasswd(text) {
  return { type: types.UPDATE_PASSWD, text };
}
