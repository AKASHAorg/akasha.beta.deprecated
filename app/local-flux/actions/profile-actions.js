import { action } from './helpers';
import * as types from '../constants';

export const profileAethTransfersIterator = () => action(types.PROFILE_AETH_TRANSFERS_ITERATOR);

export const profileAethTransfersIteratorError = (error) => {
    error.code = 'PATIE01';
    error.messageId = 'profileAethTransfersIterator';
    return action(types.PROFILE_AETH_TRANSFERS_ITERATOR_ERROR, { error });
};

export const profileAethTransfersIteratorSuccess = data =>
    action(types.PROFILE_AETH_TRANSFERS_ITERATOR_SUCCESS, { data });
export const profileBondAeth = ({ actionId, amount }) =>
    action(types.PROFILE_BOND_AETH, { actionId, amount });

export const profileBondAethError = (error, amount) => {
    error.code = 'PBAE01';
    error.messageId = 'profileBondAeth';
    error.values = { amount };
    return action(types.PROFILE_BOND_AETH_ERROR, { error });
};

export const profileBondAethSuccess = data => action(types.PROFILE_BOND_AETH_SUCCESS, { data });
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
export const profileCycleAeth = ({ actionId, amount }) =>
    action(types.PROFILE_CYCLE_AETH, { actionId, amount });

export const profileCycleAethError = (error, amount) => {
    error.code = 'PCAE01';
    error.messageId = 'profileCycleAeth';
    error.values = { amount };
    return action(types.PROFILE_CYCLE_AETH_ERROR, { error });
};

export const profileCycleAethSuccess = data => action(types.PROFILE_CYCLE_AETH_SUCCESS, { data });
export const profileCyclingStates = () => action(types.PROFILE_CYCLING_STATES);

export const profileCyclingStatesError = (error) => {
    error.code = 'PCSE01';
    error.messageId = 'profileCyclingStates';
    return action(types.PROFILE_CYCLING_STATES_ERROR, { error });
};

export const profileCyclingStatesSuccess = data => action(types.PROFILE_CYCLING_STATES_SUCCESS, { data });
export const profileDeleteLogged = () => action(types.PROFILE_DELETE_LOGGED);

export const profileDeleteLoggedError = (error) => {
    error.code = 'PDLE01';
    error.messageId = 'profileDeleteError';
    return action(types.PROFILE_DELETE_LOGGED_ERROR);
};

export const profileDeleteLoggedSuccess = () => action(types.PROFILE_DELETE_LOGGED_SUCCESS);
export const profileFollow = ({ actionId, ethAddress }) =>
    action(types.PROFILE_FOLLOW, { actionId, ethAddress });

export const profileFollowError = (error, request) => {
    error.code = 'PFE01';
    error.messageId = 'profileFollow';
    return action(types.PROFILE_FOLLOW_ERROR, { error, request });
};

export const profileFollowersIterator = ethAddress =>
    action(types.PROFILE_FOLLOWERS_ITERATOR, { ethAddress });

export const profileFollowersIteratorError = (error, request) => {
    error.code = 'PFIE01';
    error.messageId = 'profileFollowersIterator';
    return action(types.PROFILE_FOLLOWERS_ITERATOR_ERROR, { error, request });
};

export const profileFollowersIteratorSuccess = (data, request) =>
    action(types.PROFILE_FOLLOWERS_ITERATOR_SUCCESS, { data, request });
export const profileFollowingsIterator = ethAddress =>
    action(types.PROFILE_FOLLOWINGS_ITERATOR, { ethAddress });

export const profileFollowingsIteratorError = (error, request) => {
    error.code = 'PFIE02';
    error.messageId = 'profileFollowingsIterator';
    return action(types.PROFILE_FOLLOWINGS_ITERATOR_ERROR, { error, request });
};

export const profileFollowingsIteratorSuccess = (data, request) =>
    action(types.PROFILE_FOLLOWINGS_ITERATOR_SUCCESS, { data, request });
export const profileFollowSuccess = data => action(types.PROFILE_FOLLOW_SUCCESS, { data });
export const profileFreeAeth = ({ actionId, amount }) =>
    action(types.PROFILE_FREE_AETH, { actionId, amount });

export const profileFreeAethError = (error) => {
    error.code = 'PFAE01';
    error.messageId = 'profileFreeAeth';
    return action(types.PROFILE_FREE_AETH_ERROR, { error });
};

export const profileFreeAethSuccess = data => action(types.PROFILE_FREE_AETH_SUCCESS, { data });
export const profileGetBalance = () => action(types.PROFILE_GET_BALANCE);

export const profileGetBalanceError = (error) => {
    error.code = 'PGBE01';
    error.messageId = 'profileGetBalance';
    return action(types.PROFILE_GET_BALANCE_ERROR, { error });
};

export const profileGetBalanceSuccess = data => action(types.PROFILE_GET_BALANCE_SUCCESS, { data });
export const profileGetByAddress = ethAddress => action(types.PROFILE_GET_BY_ADDRESS, { ethAddress });

export const profileGetByAddressError = (error, request) => {
    error.code = 'PGBAE01';
    error.messageId = 'profileGetByAddress';
    return action(types.PROFILE_GET_BY_ADDRESS_ERROR, { error, request });
};

export const profileGetByAddressSuccess = data => action(types.PROFILE_GET_BY_ADDRESS_SUCCESS, { data });
export const profileGetData = ({ akashaId, ethAddress, full }) =>
    action(types.PROFILE_GET_DATA, { akashaId, ethAddress, full });

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
    error.code = 'PGLE03';
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
export const profileManaBurned = () => action(types.PROFILE_MANA_BURNED);

export const profileManaBurnedError = (error) => {
    error.code = 'PMBE01';
    error.messageId = 'profileManaBurned';
    return action(types.PROFILE_MANA_BURNED_ERROR, { error });
};

export const profileManaBurnedSuccess = data => action(types.PROFILE_MANA_BURNED_SUCCESS, { data });
export const profileMoreFollowersIterator = ethAddress =>
    action(types.PROFILE_MORE_FOLLOWERS_ITERATOR, { ethAddress });

export const profileMoreFollowersIteratorError = (error, request) => {
    error.code = 'PMFIE01';
    error.messageId = 'profileMoreFollowersIterator';
    return action(types.PROFILE_MORE_FOLLOWERS_ITERATOR_ERROR, { error, request });
};

export const profileMoreFollowersIteratorSuccess = (data, request) =>
    action(types.PROFILE_MORE_FOLLOWERS_ITERATOR_SUCCESS, { data, request });
export const profileMoreFollowingsIterator = ethAddress =>
    action(types.PROFILE_MORE_FOLLOWINGS_ITERATOR, { ethAddress });

export const profileMoreFollowingsIteratorError = (error, request) => {
    error.code = 'PMFIE02';
    error.messageId = 'profileMoreFollowingsIterator';
    return action(types.PROFILE_MORE_FOLLOWINGS_ITERATOR_ERROR, { error, request });
};

export const profileMoreFollowingsIteratorSuccess = (data, request) =>
    action(types.PROFILE_MORE_FOLLOWINGS_ITERATOR_SUCCESS, { data, request });

export const profileRegister = ({ actionId, akashaId, address, about, avatar, backgroundImage, donationsEnabled, firstName, lastName, links, ethAddress }) =>
    action(types.PROFILE_REGISTER, { actionId, akashaId, address, about, avatar, backgroundImage, donationsEnabled, firstName, lastName, links, ethAddress });

export const profileRegisterError = (error, req) => {
    error.code = 'PRE01';
    error.messageId = 'profileRegister';
    return action(types.PROFILE_REGISTER_ERROR, { error, req });
};

export const profileRegisterSuccess = (data, req) =>
    action(types.PROFILE_REGISTER_SUCCESS, { data, req });


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

export const profileSendTip = ({ actionId, akashaId, ethAddress, message, receiver, value }) =>
    action(types.PROFILE_SEND_TIP, { actionId, akashaId, ethAddress, message, receiver, value });

export const profileSendTipError = (error, request) => {
    error.code = 'PSTE01';
    error.messageId = 'profileSendTip';
    return action(types.PROFILE_SEND_TIP_ERROR, { error, request });
};

export const profileSendTipSuccess = data => action(types.PROFILE_SEND_TIP_SUCCESS, { data });

export const profileToggleInterest = (interest, interestType) =>
    action(types.PROFILE_TOGGLE_INTEREST, { interest, interestType });
export const profileTransferAeth = ({ actionId, akashaId, ethAddress, tokenAmount }) =>
    action(types.PROFILE_TRANSFER_AETH, { actionId, akashaId, ethAddress, tokenAmount });

export const profileTransferAethError = (error, request) => {
    error.code = 'PTAE01';
    error.messageId = 'profileTransferAeth';
    error.values = { tokenAmount: request.tokenAmount };
    return action(types.PROFILE_TRANSFER_AETH_ERROR, { error });
};

export const profileTransferAethSuccess = data => action(types.PROFILE_TRANSFER_AETH_SUCCESS, { data });
export const profileTransferEth = ({ actionId, akashaId, ethAddress, value }) =>
    action(types.PROFILE_TRANSFER_ETH, { actionId, akashaId, ethAddress, value });

export const profileTransferEthError = (error, request) => {
    error.code = 'PTEE01';
    error.messageId = 'profileTransferEth';
    error.values = { value: request.value };
    return action(types.PROFILE_TRANSFER_ETH_ERROR, { error });
};

export const profileTransferEthSuccess = data => action(types.PROFILE_TRANSFER_ETH_SUCCESS, { data });
export const profileTransformEssence = ({ actionId, amount }) =>
    action(types.PROFILE_TRANSFORM_ESSENCE, { actionId, amount });

export const profileTransformEssenceError = (error, amount) => {
    error.code = 'PTEE02';
    error.messageId = 'profileTransformEssence';
    error.values = { amount };
    return action(types.PROFILE_TRANSFORM_ESSENCE_ERROR, { error });
};

export const profileTransformEssenceSuccess = data =>
    action(types.PROFILE_TRANSFORM_ESSENCE_SUCCESS, { data });
export const profileUnfollow = ({ actionId, ethAddress }) =>
    action(types.PROFILE_UNFOLLOW, { actionId, ethAddress });

export const profileUnfollowError = (error, request) => {
    error.code = 'PUE01';
    error.messageId = 'profileUnfollow';
    return action(types.PROFILE_UNFOLLOW_ERROR, { error, request });
};

export const profileUnfollowSuccess = data => action(types.PROFILE_UNFOLLOW_SUCCESS, { data });

export const profileUpdate = ({ actionId, about, avatar, backgroundImage, firstName, lastName, links }) =>
    action(types.PROFILE_UPDATE, { actionId, about, avatar, backgroundImage, firstName, lastName, links });

export const profileUpdateError = (error, req) => {
    error.code = 'PUE01';
    error.messageId = 'profileUpdate';
    return action(types.PROFILE_UPDATE_ERROR, { error, req });
};

export const profileUpdateSuccess = (data, req) =>
    action(types.PROFILE_UPDATE_SUCCESS, { data, req });


export const profileUpdateLoggedError = (error) => {
    error.code = 'PULE01';
    error.messageId = 'profileUpdateLogged';
    return action(types.PROFILE_UPDATE_LOGGED_ERROR, { error });
};
