import * as types from '../../constants/ProfileConstants';

export function login () {
    return {
        type: types.LOGIN
    };
}

export function loginSuccess (profile) {
    return {
        type: types.LOGIN_SUCCESS,
        profile
    };
}

export function loginError (error) {
    error.code = 'LOGINE01';
    return {
        type: types.LOGIN_ERROR,
        error
    };
}

export function getCurrentProfileSuccess (data) {
    return {
        type: types.GET_CURRENT_PROFILE_SUCCESS,
        data
    };
}

export function getCurrentProfileError (error) {
    return {
        type: types.GET_CURRENT_PROFILE_ERROR,
        error
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
export function getLocalProfiles () {
    return {
        type: types.GET_LOCAL_PROFILES
    };
}
export function getLocalProfilesSuccess (data) {
    return {
        type: types.GET_LOCAL_PROFILES_SUCCESS,
        data
    };
}
export function getLocalProfilesError (error) {
    error.code = 'GLPE01';
    return {
        type: types.GET_LOCAL_PROFILES_ERROR,
        error
    };
}

export function getProfileDataSuccess (data) {
    return {
        type: types.GET_PROFILE_DATA_SUCCESS,
        data
    };
}

export function clearLocalProfilesSuccess () {
    return {
        type: types.CLEAR_LOCAL_PROFILES_SUCCESS
    };
}

export function getProfileDataError (error) {
    error.code = 'GPDE01';
    return {
        type: types.GET_PROFILE_DATA_ERROR,
        error
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

export function deleteUpdateProfileTx () {
    return {
        type: types.DELETE_UPDATE_PROFILE_TX
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

export function getLoggedProfile () {
    return {
        type: types.GET_LOGGED_PROFILE
    };
}
export function getLoggedProfileSuccess (profile) {
    return {
        type: types.GET_LOGGED_PROFILE_SUCCESS,
        profile
    };
}

export function getLoggedProfileError (error) {
    error.code = 'GLPE02';
    return {
        type: types.GET_LOGGED_PROFILE_ERROR,
        error
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
