import * as types from '../constants/AuthConstants'
const remote = require('electron').remote;
const profileHelpers = remote.getGlobal('akasha').profileHelpers;

function authSuccess() {
  return { type: types.AUTH_LOGIN_SUCCESS };
}

function authFailure(reason) {
  return { type: types.AUTH_LOGIN_FAILURE, reason };
}

export function authenticate(user, password, timer) {
  return (dispatch, getState) => {
    profileHelpers.login(user, password, timer)
                  .then(
                    (success) => {
                      if (success) {
                        return dispatch(authSuccess);
                      }
                      return dispatch(authFailure('password not correct'));
                    }
                  )
                  .catch(
                    (err) => {
                      dispatch(authFailure(err));
                    }
                  );
  };
}

