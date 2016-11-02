import * as types from '../../constants/ProfileConstants';

export function login (flags) {
    return {
        type: types.LOGIN,
        flags
    };
}

export function loginSuccess (profile, flags) {
    return {
        type: types.LOGIN_SUCCESS,
        profile,
        flags
    };
}

export function loginError (error, flags) {
    error.code = 'LOGINE01';
    return {
        type: types.LOGIN_ERROR,
        error,
        flags
    };
}
export function getCurrentProfile (flags) {
    return {
        type: types.GET_CURRENT_PROFILE,
        flags
    };
}
export function getCurrentProfileSuccess (data, flags) {
    return {
        type: types.GET_CURRENT_PROFILE_SUCCESS,
        data,
        flags
    };
}

export function getCurrentProfileError (error, flags) {
    return {
        type: types.GET_CURRENT_PROFILE_ERROR,
        error,
        flags
    };
}

export function logoutSuccess (result) {
    return {
        type: types.LOGOUT_SUCCESS,
        result
    };
}

export function logoutError (error) {
    error.code = 'LOGOUTE01';
    return {
        type: types.LOGOUT_ERROR,
        error
    };
}
export function getLocalProfiles (flags) {
    return {
        type: types.GET_LOCAL_PROFILES,
        flags
    };
}
export function getLocalProfilesSuccess (data, flags) {
    return {
        type: types.GET_LOCAL_PROFILES_SUCCESS,
        data,
        flags
    };
}

export function getLocalProfilesError (error, flags) {
    error.code = 'GLPE01';
    return {
        type: types.GET_LOCAL_PROFILES_ERROR,
        error,
        flags
    };
}

export function getProfileData (flags) {
    return {
        type: types.GET_PROFILE_DATA,
        flags
    };
}

export function getProfileDataSuccess (data, flags) {
    return {
        type: types.GET_PROFILE_DATA_SUCCESS,
        data,
        flags
    };
}

export function getProfileDataError (error) {
    error.code = 'GPDE01';
    return {
        type: types.GET_PROFILE_DATA_ERROR,
        error
    };
}

export function clearLocalProfilesSuccess () {
    return {
        type: types.CLEAR_LOCAL_PROFILES_SUCCESS
    };
}


export function updateProfileData () {
    return {
        type: types.UPDATE_PROFILE_DATA
    };
}

export function updateProfileDataSuccess (profileData) {
    return {
        type: types.UPDATE_PROFILE_DATA_SUCCESS,
        profileData
    };
}

export function updateProfileDataError (error) {
    error.code = 'UPDE01';
    return {
        type: types.UPDATE_PROFILE_DATA_ERROR,
        error
    };
}

export function addUpdateProfileTx () {
    return {
        type: types.ADD_UPDATE_PROFILE_TX
    };
}

export function addUpdateProfileTxSuccess (data) {
    return {
        type: types.ADD_UPDATE_PROFILE_TX_SUCCESS,
        data
    };
}

export function addUpdateProfileTxError (error) {
    error.code = 'AUPTE01';
    return {
        type: types.ADD_UPDATE_PROFILE_TX_ERROR,
        error
    };
}

export function deleteUpdateProfileTxSuccess (tx) {
    return {
        type: types.DELETE_UPDATE_PROFILE_TX_SUCCESS,
        tx
    };
}

export function deleteUpdateProfileTxError (error) {
    error.code = 'DUPTE01';
    return {
        type: types.DELETE_UPDATE_PROFILE_TX_ERROR,
        error
    };
}

export function getUpdateProfileTxs () {
    return {
        type: types.GET_UPDATE_PROFILE_TXS,
    };
}

export function getUpdateProfileTxsSuccess (profiles) {
    return {
        type: types.GET_UPDATE_PROFILE_TXS_SUCCESS,
        profiles
    };
}

export function getUpdateProfileTxsError (error) {
    error.code = 'GUPTE01';
    return {
        type: types.GET_UPDATE_PROFILE_TXS_ERROR,
        error
    };
}

export function getLoggedProfile (flags) {
    return {
        type: types.GET_LOGGED_PROFILE,
        flags
    };
}
export function getLoggedProfileSuccess (profile, flags) {
    return {
        type: types.GET_LOGGED_PROFILE_SUCCESS,
        profile,
        flags
    };
}

export function getLoggedProfileError (error, flags) {
    error.code = 'GLPE02';
    return {
        type: types.GET_LOGGED_PROFILE_ERROR,
        error,
        flags
    };
}

export function getFullLoggedProfile () {
    return {
        type: types.GET_FULL_LOGGED_PROFILE
    };
}

export function deleteLoggedProfileSuccess () {
    return {
        type: types.CLEAR_LOGGED_PROFILE_SUCCESS
    };
}

export function deleteLoggedProfileError (error) {
    error.code = 'CLPE01';
    return {
        type: types.CLEAR_LOGGED_PROFILE_ERROR,
        error
    };
}

export function getProfileBalanceSuccess (data) {
    return {
        type: types.GET_PROFILE_BALANCE_SUCCESS,
        data
    };
}

export function getProfileBalanceError (error) {
    error.code = 'GPBE01';
    return {
        types: types.GET_PROFILE_BALANCE_ERROR,
        error
    };
}

export function clearErrors () {
    return {
        type: types.CLEAR_PROFILE_ERRORS
    };
}

export function showNotification (notification) {
    return {
        type: types.SHOW_NOTIFICATION,
        notification
    };
}

export function hideNotification (notification) {
    return {
        type: types.HIDE_NOTIFICATION,
        notification
    };
}

export function resetFlags () {
    return {
        type: types.RESET_FLAGS,
    };
}
