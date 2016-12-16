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
    console.error(error);
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

export function getProfileDataError (error, flags) {
    error.code = 'GPDE01';
    return {
        type: types.GET_PROFILE_DATA_ERROR,
        error,
        flags
    };
}

export function getProfileList (flags) {
    return {
        type: types.GET_PROFILE_LIST,
        flags
    };
}

export function getProfileListSuccess (data, flags) {
    return {
        type: types.GET_PROFILE_LIST_SUCCESS,
        data,
        flags
    };
}

export function getProfileListError (error, flags) {
    error.code = 'GPLE01';
    return {
        type: types.GET_PROFILE_LIST_ERROR,
        error,
        flags
    };
}

export function clearLocalProfilesSuccess () {
    return {
        type: types.CLEAR_LOCAL_PROFILES_SUCCESS
    };
}

export function clearOtherProfiles () {
    return {
        type: types.CLEAR_OTHER_PROFILES
    };
}

export function updateProfileData (flags) {
    return {
        type: types.UPDATE_PROFILE_DATA,
        flags
    };
}

export function updateProfileDataSuccess (flags) {
    return {
        type: types.UPDATE_PROFILE_DATA_SUCCESS,
        flags
    };
}

export function updateProfileDataError (error, flags) {
    error.code = 'UPDE01';
    return {
        type: types.UPDATE_PROFILE_DATA_ERROR,
        error,
        flags
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

export function getFollowersCount () {
    return {
        type: types.GET_FOLLOWERS_COUNT
    };
}

export function getFollowersCountSuccess (akashaId, count) {
    return {
        type: types.GET_FOLLOWERS_COUNT_SUCCESS,
        akashaId,
        count
    };
}

export function getFollowersCountError (error) {
    error.code = 'GFRCE01';
    return {
        type: types.GET_FOLLOWERS_COUNT_ERROR,
        error
    };
}

export function getFollowingCount () {
    return {
        type: types.GET_FOLLOWING_COUNT
    };
}

export function getFollowingCountSuccess (akashaId, count) {
    return {
        type: types.GET_FOLLOWING_COUNT_SUCCESS,
        akashaId,
        count
    };
}

export function getFollowingCountError (error) {
    error.code = 'GFGCE01';
    return {
        type: types.GET_FOLLOWING_COUNT_ERROR,
        error
    };
}

export function followersIterator (flags) {
    return {
        type: types.FOLLOWERS_ITERATOR,
        flags
    };
}

export function followersIteratorSuccess (data, flags) {
    return {
        type: types.FOLLOWERS_ITERATOR_SUCCESS,
        data,
        flags
    };
}

export function followersIteratorError (error, flags) {
    return {
        type: types.FOLLOWERS_ITERATOR_ERROR,
        error,
        flags
    };
}

export function moreFollowersIterator (flags) {
    return {
        type: types.MORE_FOLLOWERS_ITERATOR,
        flags
    };
}

export function moreFollowersIteratorSuccess (data, flags) {
    return {
        type: types.MORE_FOLLOWERS_ITERATOR_SUCCESS,
        data,
        flags
    };
}

export function moreFollowersIteratorError (error, flags) {
    return {
        type: types.MORE_FOLLOWERS_ITERATOR_ERROR,
        error,
        flags
    };
}

export function followingIterator (flags) {
    return {
        type: types.FOLLOWING_ITERATOR,
        flags
    };
}

export function followingIteratorSuccess (data, flags) {
    return {
        type: types.FOLLOWING_ITERATOR_SUCCESS,
        data,
        flags
    };
}

export function followingIteratorError (error, flags) {
    return {
        type: types.FOLLOWING_ITERATOR_ERROR,
        error,
        flags
    };
}

export function moreFollowingIterator (flags) {
    return {
        type: types.MORE_FOLLOWING_ITERATOR,
        flags
    };
}

export function moreFollowingIteratorSuccess (data, flags) {
    return {
        type: types.MORE_FOLLOWING_ITERATOR_SUCCESS,
        data,
        flags
    };
}

export function moreFollowingIteratorError (error, flags) {
    return {
        type: types.MORE_FOLLOWING_ITERATOR_ERROR,
        error,
        flags
    };
}

export function followProfile (flags) {
    return {
        type: types.FOLLOW_PROFILE,
        flags
    };
}

export function followProfileSuccess (flags) {
    return {
        type: types.FOLLOW_PROFILE_SUCCESS,
        flags
    };
}

export function followProfileError (error, flags) {
    error.code = 'FPE01';
    return {
        type: types.FOLLOW_PROFILE_ERROR,
        error,
        flags
    };
}

export function unfollowProfile (flags) {
    return {
        type: types.UNFOLLOW_PROFILE,
        flags
    };
}

export function unfollowProfileSuccess (flags) {
    return {
        type: types.UNFOLLOW_PROFILE_SUCCESS,
        flags
    };
}

export function unfollowProfileError (error, flags) {
    error.code = 'UPE01';
    return {
        type: types.UNFOLLOW_PROFILE_ERROR,
        error,
        flags
    };
}

export function isFollower (flags) {
    return {
        type: types.IS_FOLLOWER,
        flags
    };
}

export function isFollowerSuccess (data, flags) {
    return {
        type: types.IS_FOLLOWER_SUCCESS,
        data,
        flags
    };
}
export function isFollowerError (error, flags) {
    error.code = 'IFE01';
    return {
        type: types.IS_FOLLOWER_ERROR,
        error,
        flags
    };
}

export function clearFollowers (akashaId) {
    return {
        type: types.CLEAR_FOLLOWERS,
        akashaId
    };
}

export function clearFollowing (akashaId) {
    return {
        type: types.CLEAR_FOLLOWING,
        akashaId
    };
}
