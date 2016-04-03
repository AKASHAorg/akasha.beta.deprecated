import * as types from '../constants/AuthConstants';
const remote = require('electron').remote;
const profileHelpers = remote.getGlobal('akasha').profileHelpers;

/**
 * Action for login success
 * @returns {{type}}
 */
function authSuccess() {
  return { type: types.AUTH_LOGIN_SUCCESS };
}

/**
 * Action for flagging failed login
 * @param reason
 * @returns {{type, reason: *}}
 */
function authFailure(reason) {
  return { type: types.AUTH_LOGIN_FAILURE, reason };
}

/**
 * Action for storing local profiles into state tree
 * @param data
 * @returns {{type, data: *}}
 */
function setLocalProfiles(data) {
  return { type: types.LOCAL_PROFILES_FOUND, data };
}

/**
 * Action for flagging no users
 * @param message
 * @returns {{type, message: string}}
 */
function noLocalProfiles(message = 'no profiles') {
  return { type: types.LOCAL_PROFILES_NONE, message };
}

/**
 * Dispatcher for local account list
 * @returns {function()}
 */
export function getAccountsList() {
  return (dispatch) => {
    profileHelpers.getLocalProfiles().then(
      (data) => {
        if (!data.length) {
          return dispatch(noLocalProfiles());
        }
        return dispatch(setLocalProfiles(data));
      }
    ).catch(
      (err) => {
        dispatch(noLocalProfiles(err));
      }
    );
  };
}

/**
 * Dispatcher for login actions
 * @param user
 * @param password
 * @param timer
 * @returns {function()}
 */
export function authenticate(user, password, timer) {
  return (dispatch) =>
    profileHelpers.login(user, password, timer)
                  .then(
                    (success) => {
                      if (success) {
                        return dispatch(authSuccess());
                      }
                      return dispatch(authFailure('password not correct'));
                    }
                  )
                  .catch(
                    (err) =>
                      dispatch(authFailure(err))
                  );
}

