import * as types from '../../constants/ProfileConstants';

export function loginSuccess (profile) {
    return {
        type: types.LOGIN_SUCCESS,
        profile
    };
}

export function loginError (error) {
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
    }
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
    return {
        type: types.PUBLISH_PROFILE_ERROR,
        error
    };
}

export function getLocalProfilesSuccess (data) {
    return {
        type: types.GET_LOCAL_PROFILES_SUCCESS,
        data
    };
}
export function getLocalProfilesError (error) {
    error.code = 'GLPE';
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

export function getProfileDataError (error) {
    return {
        type: types.GET_PROFILE_DATA_ERROR,
        error
    };
}

export function clearErrors () {
    return {
        type: types.CLEAR_PROFILE_ERRORS
    };
}
