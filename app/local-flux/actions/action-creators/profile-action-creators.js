import * as types from '../../constants/ProfileConstants';

export function loginSuccess (profileData) {
    return {
        type: types.LOGIN_SUCCESS,
        profileData
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

export function createTempProfileSuccess (profileData, currentStatus) {
    return {
        type: types.CREATE_TEMP_PROFILE_SUCCESS,
        profileData,
        currentStatus
    };
}

export function createTempProfileError (error) {
    return {
        type: types.CREATE_TEMP_PROFILE_ERROR,
        error
    };
}

export function updateTempProfileSuccess (profileData, currentStatus) {
    return {
        type: types.UPDATE_TEMP_PROFILE_SUCCESS,
        profileData,
        currentStatus
    };
}

export function updateTempProfileError (error) {
    return {
        type: types.UPDATE_TEMP_PROFILE_ERROR,
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

export function requestFund () {
    return {
        type: types.FUND_FROM_FAUCET
    };
}

export function requestFundSuccess (data) {
    return {
        type: types.REQUEST_FUND_FROM_FAUCET_SUCCESS,
        data
    };
}
export function requestFundError (error) {
    return {
        type: types.REQUEST_FUND_FROM_FAUCET_ERROR,
        error
    };
}

export function fundSuccess (data) {
    return {
        type: types.FUND_FROM_FAUCET_SUCCESS,
        data
    };
}

export function fundError (error) {
    return {
        type: types.FUND_FROM_FAUCET_ERROR,
        error
    };
}

export function completeProfileCreationSuccess (profileData) {
    return {
        type: types.COMPLETE_PROFILE_CREATION_SUCCESS,
        profileData
    };
}

export function completeProfileCreationError (error) {
    return {
        type: types.COMPLETE_PROFILE_CREATION_ERROR,
        error
    };
}

export function checkTempProfileError (error) {
    return {
        type: types.CHECK_TEMP_PROFILE_ERROR,
        error
    };
}

export function getProfilesListSuccess (profiles) {
    return {
        type: types.GET_PROFILES_LIST_SUCCESS,
        profiles
    };
}

export function getProfilesListError (error) {
    return {
        type: types.GET_PROFILES_LIST_ERROR,
        error
    };
}

export function getProfileDataSuccess (profile) {
    return {
        type: types.GET_PROFILE_DATA_SUCCESS,
        profile: profile.data
    };
}

export function getProfileDataError (error) {
    return {
        type: types.GET_PROFILE_DATA_ERROR,
        error
    };
}

export function setActionAfterAuth (nextAction) {
    return {
        type: types.SET_AFTER_AUTH_ACTION,
        nextAction,
    };
}
