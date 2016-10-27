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
