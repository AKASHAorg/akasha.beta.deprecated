import * as types from '../constants/AuthConstants';

function authSuccess () {
  return { type: types.AUTH_LOGIN_SUCCESS };
}

function authFailure (reason) {
  return { type: types.AUTH_LOGIN_FAILURE, reason };
}

export function authenticate (user, password) {
  return (dispatch, getState) => {
    dispatch(authSuccess);
  };
}

