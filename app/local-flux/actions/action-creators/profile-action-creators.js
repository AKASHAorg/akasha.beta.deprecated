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
export function createTempProfile () {
    return {
        type: types.CREATE_TEMP_PROFILE
    };
}
export function createTempProfileSuccess (profileData) {
    return {
        type: types.CREATE_TEMP_PROFILE_SUCCESS,
        profileData
    };
}

export function createTempProfileError (error) {
    error.code = 'CTPE01';
    return {
        type: types.CREATE_TEMP_PROFILE_ERROR,
        error
    };
}

export function updateTempProfileSuccess (profileData, tempProfile) {
    return {
        type: types.UPDATE_TEMP_PROFILE_SUCCESS,
        tempProfile
    };
}

export function updateTempProfileError (error) {
    error.code = 'UTPE01';
    return {
        type: types.UPDATE_TEMP_PROFILE_ERROR,
        error
    };
}

export function getTempProfileSuccess (profile) {
    return {
        type: types.GET_TEMP_PROFILE_SUCCESS,
        profile
    };
}

export function getTempProfileError (error) {
    error.code = 'GTPE01';
    return {
        type: types.GET_TEMP_PROFILE_ERROR,
        error
    };
}

export function deleteTempProfileSuccess () {
    return {
        type: types.DELETE_TEMP_PROFILE_SUCCESS
    };
}

export function deleteTempProfileError (error) {
    error.code = 'DTPE01';
    return {
        type: types.DELETE_TEMP_PROFILE_ERROR,
        error
    };
}

export function createEthAddress () {
    return {
        type: types.CREATE_ETH_ADDRESS
    };
}
export function createEthAddressSuccess (data) {
    return {
        type: types.CREATE_ETH_ADDRESS_SUCCESS,
        data
    };
}
export function createEthAddressError (error) {
    error.code = 'CEAE01';
    return {
        type: types.CREATE_ETH_ADDRESS_ERROR,
        error
    };
}
export function requestFundFromFaucet () {
    return {
        type: types.REQUEST_FUND_FROM_FAUCET
    };
}

export function requestFundFromFaucetSuccess (data) {
    return {
        type: types.REQUEST_FUND_FROM_FAUCET_SUCCESS,
        data
    };
}
export function requestFundFromFaucetError (error) {
    error.code = 'RFFE01';
    return {
        type: types.REQUEST_FUND_FROM_FAUCET_ERROR,
        error
    };
}

export function listenFaucetTx () {
    return {
        type: types.LISTEN_FAUCET_TX
    };
}

export function listenPublishTx () {
    return {
        type: types.LISTEN_PUBLISH_TX
    };
}

export function publishProfile () {
    return {
        type: types.PUBLISH_PROFILE
    };
}
export function publishProfileSuccess (profileData) {
    return {
        type: types.PUBLISH_PROFILE_SUCCESS,
        profileData
    };
}

export function publishProfileError (error) {
    error.code = 'PPE01';
    return {
        type: types.PUBLISH_PROFILE_ERROR,
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
    }
}

export function getProfileDataError (error) {
    error.code = 'GPDE01';
    return {
        type: types.GET_PROFILE_DATA_ERROR,
        error
    };
}

export function getLoggedProfileSuccess (data) {
    return {
        type: types.GET_LOGGED_PROFILE_SUCCESS,
        data
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
