import { action } from './helpers';
import * as types from '../constants';

export const profileClearLocal = () => action(types.PROFILE_CLEAR_LOCAL);
export const profileClearLoginErrors = () => action(types.PROFILE_CLEAR_LOGIN_ERRORS);
export const profileCreateEthAddress = ({ passphrase, passphrase1 }) =>
    action(types.PROFILE_CREATE_ETH_ADDRESS, { passphrase, passphrase1 });

export const profileCreateEthAddressError = (error) => {
    error.code = 'PCEAE01';
    error.messageId = 'profileCreateEthAddress';
    return action(types.PROFILE_CREATE_ETH_ADDRESS_ERROR, { error });
};

export const profileCreateEthAddressSuccess = data =>
    action(types.PROFILE_CREATE_ETH_ADDRESS_SUCCESS, { data });
export const profileDeleteLogged = () => action(types.PROFILE_DELETE_LOGGED);

export const profileDeleteLoggedError = (error) => {
    error.code = 'PDLE01';
    error.messageId = 'profileDeleteError';
    return action(types.PROFILE_DELETE_LOGGED_ERROR);
};

export const profileDeleteLoggedSuccess = () => action(types.PROFILE_DELETE_LOGGED_SUCCESS);
export const profileFollow = ({ actionId, akashaId }) =>
    action(types.PROFILE_FOLLOW, { actionId, akashaId });

export const profileFollowError = (error, request) => {
    error.code = 'PFE01';
    error.messageId = 'profileFollow';
    return action(types.PROFILE_FOLLOW_ERROR, { error, request });
};

export const profileFollowersIterator = akashaId =>
    action(types.PROFILE_FOLLOWERS_ITERATOR, { akashaId });

export const profileFollowersIteratorError = (error, request) => {
    error.code = 'PFIE01';
    error.messageId = 'profileFollowersIterator';
    return action(types.PROFILE_FOLLOWERS_ITERATOR_ERROR, { error, request });
};

export const profileFollowersIteratorSuccess = data =>
    action(types.PROFILE_FOLLOWERS_ITERATOR_SUCCESS, { data });
export const profileFollowingsIterator = akashaId =>
    action(types.PROFILE_FOLLOWINGS_ITERATOR, { akashaId });

export const profileFollowingsIteratorError = (error, request) => {
    error.code = 'PFIE02';
    error.messageId = 'profileFollowingsIterator';
    return action(types.PROFILE_FOLLOWINGS_ITERATOR_ERROR, { error, request });
};

export const profileFollowingsIteratorSuccess = data =>
    action(types.PROFILE_FOLLOWINGS_ITERATOR_SUCCESS, { data });
export const profileFollowSuccess = data => action(types.PROFILE_FOLLOW_SUCCESS, { data });
export const profileGetBalance = () => action(types.PROFILE_GET_BALANCE);

export const profileGetBalanceError = (error) => {
    error.code = 'PGBE01';
    error.messageId = 'profileGetBalance';
    return action(types.PROFILE_GET_BALANCE_ERROR, { error });
};

export const profileGetBalanceSuccess = data => action(types.PROFILE_GET_BALANCE_SUCCESS, { data });
export const profileGetData = (akashaId, full) => action(types.PROFILE_GET_DATA, { akashaId, full });

export const profileGetDataError = (error) => {
    error.code = 'PGDE01';
    error.messageId = 'profileGetData';
    return action(types.PROFILE_GET_DATA_ERROR, { error });
};

export const profileGetDataSuccess = data => action(types.PROFILE_GET_DATA_SUCCESS, { data });
export const profileGetList = akashaIds =>
    action(types.PROFILE_GET_LIST, { akashaIds });

export const profileGetListError = (error) => {
    error.code = 'PGLE02';
    error.messageId = 'profileGetList';
    return action(types.PROFILE_GET_LIST_ERROR, { error });
};

export const profileGetListSuccess = data => action(types.PROFILE_GET_LIST_SUCCESS, { data });
export const profileGetLocal = () => action(types.PROFILE_GET_LOCAL);

export const profileGetLocalError = (error) => {
    error.code = 'PGLE01';
    error.messageId = 'profileGetLocal';
    return action(types.PROFILE_GET_LOCAL_ERROR, { error });
};

export const profileGetLocalSuccess = data => action(types.PROFILE_GET_LOCAL_SUCCESS, { data });
export const profileGetLogged = () => action(types.PROFILE_GET_LOGGED);

export const profileGetLoggedError = (error) => {
    error.code = 'PGLE02';
    error.messageId = 'profileGetLogged';
    return action(types.PROFILE_GET_LOGGED_ERROR, { error });
};

export const profileGetLoggedSuccess = data => action(types.PROFILE_GET_LOGGED_SUCCESS, { data });
export const profileIsFollower = followings => action(types.PROFILE_IS_FOLLOWER, { followings });

export const profileIsFollowerError = (error, request) => {
    error.code = 'PIFE01';
    error.messageId = 'profileIsFollower';
    return action(types.PROFILE_IS_FOLLOWER_ERROR, { error, request });
};

export const profileIsFollowerSuccess = data =>
    action(types.PROFILE_IS_FOLLOWER_SUCCESS, { data });
export const profileLogin = data => action(types.PROFILE_LOGIN, { data });

export const profileLoginError = (error) => {
    // this error should be treated locally (in the login form) instead of globally
    error.code = 'PLIE01';
    return action(types.PROFILE_LOGIN_ERROR, { error });
};

export const profileLoginSuccess = data => action(types.PROFILE_LOGIN_SUCCESS, { data });
export const profileLogout = () => action(types.PROFILE_LOGOUT);

export const profileLogoutError = (error) => {
    error.code = 'PLOE01';
    error.messageId = 'profileLogout';
    return action(types.PROFILE_LOGOUT_ERROR);
};

export const profileLogoutSuccess = () => action(types.PROFILE_LOGOUT_SUCCESS);
export const profileMoreFollowersIterator = akashaId =>
    action(types.PROFILE_MORE_FOLLOWERS_ITERATOR, { akashaId });

export const profileMoreFollowersIteratorError = (error, request) => {
    error.code = 'PMFIE01';
    error.messageId = 'profileMoreFollowersIterator';
    return action(types.PROFILE_MORE_FOLLOWERS_ITERATOR_ERROR, { error, request });
};

export const profileMoreFollowersIteratorSuccess = data =>
    action(types.PROFILE_MORE_FOLLOWERS_ITERATOR_SUCCESS, { data });
export const profileMoreFollowingsIterator = akashaId =>
    action(types.PROFILE_MORE_FOLLOWINGS_ITERATOR, { akashaId });

export const profileMoreFollowingsIteratorError = (error, request) => {
    error.code = 'PMFIE02';
    error.messageId = 'profileMoreFollowingsIterator';
    return action(types.PROFILE_MORE_FOLLOWINGS_ITERATOR_ERROR, { error, request });
};

export const profileMoreFollowingsIteratorSuccess = data =>
    action(types.PROFILE_MORE_FOLLOWINGS_ITERATOR_SUCCESS, { data });
export const profileResolveIpfsHash = (ipfsHash, columnId, akashaIds) =>
    action(types.PROFILE_RESOLVE_IPFS_HASH, { ipfsHash, columnId, akashaIds });

export const profileResolveIpfsHashError = (error, req) => {
    error.code = 'PRIHE01';
    error.messageId = 'profileResolveIpfsHash';
    return action(types.PROFILE_RESOLVE_IPFS_HASH_ERROR, { error, req });
};

export const profileResolveIpfsHashSuccess = (data, req) =>
    action(types.PROFILE_RESOLVE_IPFS_HASH_SUCCESS, { data, req });

export const profileSaveAkashaIdsError = (error) => {
    error.code = 'PSAIE01';
    error.messageId = 'profileSaveAkashaIds';
    return action(types.PROFILE_SAVE_AKASHA_IDS_ERROR, { error });
};

export const profileSaveLoggedError = (error) => {
    error.code = 'PSLE01';
    error.fatal = true;
    return action(types.PROFILE_SAVE_LOGGED_ERROR, { error });
};

export const profileSendTip = ({ actionId, akashaId, message, receiver, value }) =>
    action(types.PROFILE_SEND_TIP, { actionId, akashaId, message, receiver, value });

export const profileSendTipError = (error, request) => {
    error.code = 'PSTE01';
    error.messageId = 'profileSendTip';
    return action(types.PROFILE_SEND_TIP_ERROR, { error, request });
};

export const profileSendTipSuccess = data => action(types.PROFILE_SEND_TIP_SUCCESS, { data });

export const profileToggleInterest = (interest, interestType) =>
    action(types.PROFILE_TOGGLE_INTEREST, { interest, interestType });

export const profileUnfollow = ({ actionId, akashaId }) =>
    action(types.PROFILE_UNFOLLOW, { actionId, akashaId });

export const profileUnfollowError = (error, request) => {
    error.code = 'PUE01';
    error.messageId = 'profileUnfollow';
    return action(types.PROFILE_UNFOLLOW_ERROR, { error, request });
};

export const profileUnfollowSuccess = data => action(types.PROFILE_UNFOLLOW_SUCCESS, { data });

export const profileUpdateLoggedError = (error) => {
    error.code = 'PULE01';
    error.messageId = 'profileUpdateLogged';
    return action(types.PROFILE_UPDATE_LOGGED_ERROR, { error });
};
