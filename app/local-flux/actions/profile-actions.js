import { action } from './helpers';
import * as types from '../constants';
import { PROFILE_MODULE, REGISTRY_MODULE } from '@akashaproject/common/constants';

// export const profileAethTransfersIterator = () => action(types.PROFILE_AETH_TRANSFERS_ITERATOR);

// export const profileAethTransfersIteratorError = (error) => {
//     error.code = 'PATIE01';
//     error.messageId = 'profileAethTransfersIterator';
//     return action(types.PROFILE_AETH_TRANSFERS_ITERATOR_ERROR, { error });
// };

// export const profileAethTransfersIteratorSuccess = data =>
//     action(types.PROFILE_AETH_TRANSFERS_ITERATOR_SUCCESS, { data });

// export const profileAllFollowings = following => action(types.PROFILE_ALL_FOLLOWINGS, { following });

export const profileBondAeth = ({ actionId, amount }) =>
    action(`${PROFILE_MODULE.bondAeth}`, { actionId, amount });

export const profileClearLocal = () => action(types.PROFILE_CLEAR_LOCAL);
export const profileClearLoginErrors = () => action(types.PROFILE_CLEAR_LOGIN_ERRORS);

export const profileCommentsIterator = column => action(`${PROFILE_MODULE.commentsIterator}`, { column });

export const profileCreateEthAddress = ({ passphrase, passphrase1 }) =>
    action(types.PROFILE_CREATE_ETH_ADDRESS, { passphrase, passphrase1 });
export const profileCreateEthAddressError = error => {
    error.code = 'PCEAE01';
    error.messageId = 'profileCreateEthAddress';
    return action(types.PROFILE_CREATE_ETH_ADDRESS_ERROR, { error });
};
export const profileCreateEthAddressSuccess = data =>
    action(types.PROFILE_CREATE_ETH_ADDRESS_SUCCESS, { data });

export const profileCycleAeth = ({ actionId, amount }) =>
    action(`${PROFILE_MODULE.cycleAeth}`, { actionId, amount });

export const profileCyclingStates = () => action(`${PROFILE_MODULE.cyclingStates}`);

export const profileDeleteLogged = () => action(types.PROFILE_DELETE_LOGGED);
export const profileDeleteLoggedError = error => {
    error.code = 'PDLE01';
    error.messageId = 'profileDeleteError';
    return action(types.PROFILE_DELETE_LOGGED_ERROR);
};
export const profileDeleteLoggedSuccess = () => action(types.PROFILE_DELETE_LOGGED_SUCCESS);

export const profileExists = akashaId => action(`${REGISTRY_MODULE.profileExists}`, { akashaId });

export const profileFaucet = ({ actionId, ethAddress, withNotification }) =>
    action(types.PROFILE_FAUCET, { actionId, ethAddress, withNotification });
export const profileFaucetError = (error, request) => {
    error.code = 'PFE02';
    error.messageId = 'profileFaucet';
    return action(types.PROFILE_FAUCET_ERROR, { error, request });
};
export const profileFaucetSuccess = (data, request) =>
    action(types.PROFILE_FAUCET_SUCCESS, { data, request });

export const profileFollow = ({ actionId, ethAddress }) =>
    action(`${PROFILE_MODULE.followProfile}`, { actionId, ethAddress });

export const profileFollowersIterator = ({ column, batching }) =>
    action(`${PROFILE_MODULE.followersIterator}`, { column, batching });

export const profileFollowingsIterator = ({ column, limit, allFollowings, batching }) =>
    action(`${PROFILE_MODULE.followingIterator}`, { column, limit, allFollowings, batching });

export const profileFreeAeth = ({ actionId, amount }) =>
    action(`${PROFILE_MODULE.freeAeth}`, { actionId, amount });

export const profileGetBalance = () => action(`${PROFILE_MODULE.getBalance}`);

export const profileGetByAddress = ethAddress => action(`${PROFILE_MODULE.getByAddress}`, { ethAddress });

export const profileGetData = ({ akashaId, context, ethAddress, full, batching }) =>
    action(`${PROFILE_MODULE.profileData}`, { akashaId, context, ethAddress, full, batching });

// export const profileGetEntrySyncBlockError = (error) => {
//     error.code = 'PGESBE01';
//     return action(types.PROFILE_GET_ENTRY_SYNC_BLOCK_ERROR, { error });
// };
//
// export const profileGetEntrySyncBlockSuccess = block =>
//     action(types.PROFILE_GET_ENTRY_SYNC_BLOCK_SUCCESS, { block });

export const profileGetList = ethAddresses => action(`${PROFILE_MODULE.getProfileList}`, { ethAddresses });

export const profileGetLocal = polling => action(types.PROFILE_GET_LOCAL, { polling });

export const profileGetLocalError = (error, request) => {
    error.code = 'PGLE01';
    error.messageId = 'profileGetLocal';
    return action(types.PROFILE_GET_LOCAL_ERROR, { error, request });
};

export const getCurrentProfile = () => action(PROFILE_MODULE.getCurrentProfile, {});
export const getCurrentProfileError = err => action(`${PROFILE_MODULE.getCurrentProfile}_ERROR`, { err });

export const profileGetLocalSuccess = (data, request) =>
    action(types.PROFILE_GET_LOCAL_SUCCESS, { data, request });
export const profileGetLogged = () => action(types.PROFILE_GET_LOGGED);

export const profileGetLoggedError = error => {
    error.code = 'PGLE03';
    error.messageId = 'profileGetLogged';
    return action(types.PROFILE_GET_LOGGED_ERROR, { error });
};

export const profileGetLoggedSuccess = data => action(types.PROFILE_GET_LOGGED_SUCCESS, { data });

export const profileGetPublishingCost = data => action(types.PROFILE_GET_PUBLISHING_COST, { data });
export const profileGetPublishingCostSuccess = data =>
    action(types.PROFILE_GET_PUBLISHING_COST_SUCCESS, { data });
export const profileGetPublishingCostError = error =>
    action(types.PROFILE_GET_PUBLISHING_COST_ERROR, { error });

export const profileIsFollower = followings => action(`${PROFILE_MODULE.isFollower}`, { followings });

export const profileKarmaRanking = () => action(`${PROFILE_MODULE.karmaRanking}`);

export const profileKarmaRankingLoadMore = data => action(types.PROFILE_KARMA_RANKING_LOAD_MORE, { data });

export const profileLogin = data => action(types.PROFILE_LOGIN, { data });

export const profileLoginError = error => {
    // this error should be treated locally (in the login form) instead of globally
    error.code = 'PLIE01';
    return action(types.PROFILE_LOGIN_ERROR, { error });
};

export const profileLoginSuccess = data => action(types.PROFILE_LOGIN_SUCCESS, { data });
export const profileLogout = () => action(types.PROFILE_LOGOUT);

export const profileLogoutError = error => {
    error.code = 'PLOE01';
    error.messageId = 'profileLogout';
    return action(types.PROFILE_LOGOUT_ERROR);
};

export const profileLogoutSuccess = () => action(types.PROFILE_LOGOUT_SUCCESS);
export const profileManaBurned = () => action(`${PROFILE_MODULE.manaBurned}`);

// export const profileMoreCommentsIterator = column => action(types.PROFILE_MORE_COMMENTS_ITERATOR, { column });
// export const profileMoreCommentsIteratorError = (error, request) => {
//     error.code = 'PMCIE01';
//     error.messageId = 'profileMoreCommentsIterator';
//     return action(types.PROFILE_MORE_COMMENTS_ITERATOR_ERROR, { error, request });
// };
// export const profileMoreCommentsIteratorSuccess = (data, request) =>
//     action(types.PROFILE_MORE_COMMENTS_ITERATOR_SUCCESS, { data, request });

// export const profileMoreFollowersIterator = ({ column, batching }) =>
//     action(types.PROFILE_MORE_FOLLOWERS_ITERATOR, { column, batching });

// export const profileMoreFollowersIteratorError = (error, request) => {
//     error.code = 'PMFIE01';
//     error.messageId = 'profileMoreFollowersIterator';
//     return action(types.PROFILE_MORE_FOLLOWERS_ITERATOR_ERROR, { error, request });
// };

// export const profileMoreFollowersIteratorSuccess = (data, request) =>
//     action(types.PROFILE_MORE_FOLLOWERS_ITERATOR_SUCCESS, { data, request });

// export const profileMoreFollowingsIterator = ({ column, batching }) =>
//     action(types.PROFILE_MORE_FOLLOWINGS_ITERATOR, { column, batching });

// export const profileMoreFollowingsIteratorError = (error, request) => {
//     error.code = 'PMFIE02';
//     error.messageId = 'profileMoreFollowingsIterator';
//     return action(types.PROFILE_MORE_FOLLOWINGS_ITERATOR_ERROR, { error, request });
// };

// export const profileMoreFollowingsIteratorSuccess = (data, request, batching) =>
//     action(types.PROFILE_MORE_FOLLOWINGS_ITERATOR_SUCCESS, { data, request, batching });

export const profileRegister = ({
    actionId,
    akashaId,
    address,
    about,
    avatar,
    backgroundImage,
    donationsEnabled,
    firstName,
    lastName,
    links,
    ethAddress
}) =>
    action(`${REGISTRY_MODULE.registerProfile}`, {
        actionId,
        akashaId,
        address,
        about,
        avatar,
        backgroundImage,
        donationsEnabled,
        firstName,
        lastName,
        links,
        ethAddress
    });

export const profileResetColumns = ethAddress => action(types.PROFILE_RESET_COLUMNS, { ethAddress });
export const profileResetEssenceEvents = () => action(types.PROFILE_RESET_ESSENCE_EVENTS);
export const profileResetFaucet = () => action(types.PROFILE_RESET_FAUCET);

export const profileResolveIpfsHash = (ipfsHash, columnId, akashaIds) =>
    action(`${PROFILE_MODULE.resolveProfileIpfsHash}`, { ipfsHash, columnId, akashaIds });

export const profileSaveLastBlockNr = () => action(types.PROFILE_SAVE_LAST_BLOCK_NR);
export const profileSaveLastBlockNrError = error => {
    error.code = 'PSLBNE01';
    return action(types.PROFILE_SAVE_LAST_BLOCK_NR_ERROR, { error });
};

export const profileSaveLoggedError = error => {
    error.code = 'PSLE01';
    error.fatal = true;
    return action(types.PROFILE_SAVE_LOGGED_ERROR, { error });
};

export const profileSendTip = ({ actionId, akashaId, ethAddress, message, receiver, value, tokenAmount }) =>
    action(`${PROFILE_MODULE.sendTip}`, {
        actionId,
        akashaId,
        ethAddress,
        message,
        receiver,
        value,
        tokenAmount
    });

export const profileToggleInterest = (interest, interestType) =>
    action(types.PROFILE_TOGGLE_INTEREST, { interest, interestType });

export const profileToggleDonations = ({ actionId, status }) =>
    action(types.PROFILE_TOGGLE_DONATIONS, { actionId, status });

export const profileToggleDonationsError = (error, request) => {
    error.code = 'PTDE01';
    error.messageId = 'profileToggleDonations';
    error.values = { status: request.status };
    return action(types.PROFILE_TOGGLE_DONATIONS_ERROR, { error });
};

export const profileToggleDonationsSuccess = data => action(types.PROFILE_TOGGLE_DONATIONS_SUCCESS, { data });

export const profileTransferAeth = ({ actionId, akashaId, ethAddress, tokenAmount }) =>
    action(`${PROFILE_MODULE.transfer}`, { actionId, akashaId, ethAddress, tokenAmount });

export const profileTransferEth = ({ actionId, akashaId, ethAddress, value }) =>
    action(`${PROFILE_MODULE.transfer}`, { actionId, akashaId, ethAddress, value });

export const profileTransformEssence = ({ actionId, amount }) =>
    action(`${PROFILE_MODULE.transformEssence}`, { actionId, amount });

export const profileUnfollow = ({ actionId, ethAddress }) =>
    action(`${PROFILE_MODULE.unFollowProfile}`, { actionId, ethAddress });

export const profileUpdate = ({ actionId, about, avatar, backgroundImage, firstName, lastName, links }) =>
    action(`${PROFILE_MODULE.updateProfileData}`, {
        actionId,
        about,
        avatar,
        backgroundImage,
        firstName,
        lastName,
        links
    });

export const profileUpdateLoggedError = error => {
    error.code = 'PULE01';
    error.messageId = 'profileUpdateLogged';
    return action(types.PROFILE_UPDATE_LOGGED_ERROR, { error });
};

export const profileEssenceIterator = () => action(`${PROFILE_MODULE.essenceIterator}`);
