
const Promise = require('bluebird');
const remote = require('electron').remote;
import * as types from '../constants/ProfileConstants';
import { hashHistory } from 'react-router';

export function updateName (first, last) {
  return { type: types.UPDATE_NAME, first, last };
}

export function validateName (name) {
  if (!name) {
    return { type: types.VALID_NAME, valid: false };
  }
  return { type: types.VALID_NAME, valid: true };
}


function validateUser (name) {
  const prof = remote.getGlobal('akasha').profileInstance;
  const response = { type: types.VALID_USER, valid: false };
  if (!name) {
    return response;
  }
  if (name.length < 3) {
    return { ...response, err: 'user name too short' };
  }
  const valid = /^([0-9A-Za-z]*)$/.test(name);
  if (!valid) {
    return { ...response, err: 'user can contain only letters and numbers' };
  }

  return (dispatch) => {
    prof.existsProfileName(name).then((exists) => {
      if (exists) {
        dispatch({ ...response, err: 'user name is taken' });
      } else {
        dispatch({ type: types.VALID_USER, valid: true });
      }
    });
  };
}

export function updateUser (value) {
  return (dispatch) => {
    setTimeout(() => dispatch(validateUser(value)), 5);
    dispatch({ type: types.UPDATE_USER, value });
  };
}


function validatePasswd (pwd1, pwd2) {
  const response = { type: types.VALID_PASSWD, valid: false, err1: '', err2: '' };
  if (!pwd1) {
    return response;
  }
  if (pwd1.length < 6) {
    return { ...response, err1: 'password too short' };
  }
  const pat = new RegExp('^([^0-9]*|[^A-Z]*|[^a-z]*)$');
  const valid = !pat.test(pwd1);
  if (!valid) {
    return { ...response, err1: 'password must contain numbers, lower and UPPER case letters' };
  } else if (!pwd2) {
    return { ...response, err2: 'verify your password' };
  } else if (pwd1 !== pwd2) {
    return { ...response, err2: 'password missmatch' };
  } else {
    return { type: types.VALID_PASSWD, valid: true };
  }
}

export function updatePasswd (pwd1, pwd2) {
  return (dispatch) => {
    setTimeout(() => dispatch(validatePasswd(pwd1, pwd2)), 5);
    dispatch({ type: types.UPDATE_PASSWD, pwd1, pwd2 });
  };
}


export function unlockEnable (enabled) {
  return { type: types.UNLOCK_ENABLE, enabled };
}

export function unlockAccountFor (value) {
  return { type: types.UNLOCK_ACCOUNT_FOR, value };
}

export function toggleDetails (enabled) {
  return { type: types.TOGGLE_DETAILS, enabled };
}

export function createUser () {
  return (dispatch, getState) => {
    const data = getState().profile.toJS();
    const web3 = remote.getGlobal('gethInstance').web3;
    const prof = remote.getGlobal('akasha').profileInstance;
    hashHistory.push('/new-profile-status');
    console.log('Creating profile::', data);;

    // Step 1:: Create a new Ethereum address
    // Step 2:: Send ether
    // Step 3:: Unlock address
    // Step 4:: Create new AKASHA profile
    setTimeout(() => {
    //   web3.personal.newAccount(data.passwd.pwd1, (err, address) => {
      dispatch({ type: types.CREATE_USER_SUCCESS });
    //   });
    }, 3500);

    // prof.create(data.user.value, data, (err, success) => {
    //   if (err) {
    //     dispatch({ type: types.CREATE_USER_FAILURE });
    //   } else {
    //     dispatch({ type: types.CREATE_USER_SUCCESS });
    //   }
    // });

    dispatch({ type: types.CREATE_USER_PENDING, step: 'creating ethereum address' });
  };
}
