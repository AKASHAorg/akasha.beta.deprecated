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
    }
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

export function getProfileData (flags) {
    return {
        type: types.GET_PROFILE_DATA,
        flags
    }
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
