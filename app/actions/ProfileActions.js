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
  const prof = window.akasha.profileInstance;
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

export function finishSetup () {
  hashHistory.push('/landpage');
}

/**
 * Step 1:: Create a new Ethereum address
 * Step 2:: Set address as defaultAccount
 * Step 3:: Fund the address from faucet
 * Step 4:: Unlock address
 * Step 5:: Create new AKASHA profile
 */
function _createUser (dispatch, data) {
  const web3 = window.gethInstance.web3;
  const akasha = window.akasha;
  const user = data.user.value;
  dispatch({ type: types.CREATE_USER_PENDING, step: 'Creating new Ethereum address...' });

  // Step 1:: Create a new Ethereum address
  web3.personal.newAccount(data.passwd.pwd1, (err, address) => {
    if (err || !address) {
      dispatch({ type: types.CREATE_USER_FAILURE, err: 'could not create Ethereum address' });
      return;
    }
    dispatch({ type: types.CREATE_ETH_ADDRESS, address });
    dispatch({ type: types.CREATE_USER_PENDING, step: `Address: ${address};` });
    // Step 2:: Set address as defaultAccount
    web3.eth.defaultAccount = address;
    // Step 3:: Send ether
    akasha.faucet.requestEther().then((success) => {
      let unlockTime;
      dispatch({ type: types.CREATE_USER_PENDING, step: `Ethereum address funded;` });
      // Step 4:: Unlock address
      if (data.unlock.enabled) {
        unlockTime = data.unlock.value * 60;
      } else {
        unlockTime = 10;
      }
      web3.personal.unlockAccount(address, data.passwd.pwd1, unlockTime, (err, unlocked) => {
        if (data.unlock.enabled) {
          dispatch({
            type: types.CREATE_USER_PENDING,
            step: `Address unlocked for [${data.unlock.value}] minutes;`
          });
        }
        if (err || !unlocked) {
          dispatch({ type: types.CREATE_USER_FAILURE, err: 'could not unlock address' });
          return;
        }
        dispatch({
          type: types.CREATE_USER_PENDING,
          step: `Creating AKASHA profile [${user}]...`
        });
        // Step 5:: Create new AKASHA profile
        akasha.profileInstance.create(user, data.user.hash, (err, data) => {
          if (err) {
            dispatch({ type: types.CREATE_USER_FAILURE, err });
          } else {
            dispatch({ type: types.CREATE_USER_PENDING, step: 'Done!' });
            setTimeout(() => {
              dispatch({ type: types.CREATE_USER_SUCCESS });
              // Jump to dashboard next page !!
              hashHistory.push('/new-profile-complete');
            }, 3000);
          }
        });
        // End of step 5
      });
    }).catch((err) => {
      dispatch({ type: types.CREATE_USER_FAILURE, err: 'could not request ether' });
    });
  });
}

export function createUser () {
  return (dispatch, getState) => {
    const data = getState().profile.toJS();
    const profileUpload = window.akasha.profileUpload;
    const meta = {
      firstName: data.name.first,
      lastName: data.name.last,
    };
    hashHistory.push('/new-profile-status');

    profileUpload.uploadProfile(data.user.value, meta).then((hash) => {
      data.user.hash = hash;
      _createUser(dispatch, data);
    }).catch((err) => {
      dispatch({ type: types.CREATE_USER_FAILURE, err: 'could not request ether' });
    });
  };
}
