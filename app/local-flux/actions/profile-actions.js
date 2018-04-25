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

export const profileAllFollowings = following => action(types.PROFILE_ALL_FOLLOWINGS, { following });

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

export const profileCommentsIterator = (column) => action(types.PROFILE_COMMENTS_ITERATOR, { column });
export const profileCommentsIteratorError = (error) => {
    error.code = 'PCIE01';
    error.messageId = 'profileCommentsIterator';
    return action(types.PROFILE_COMMENTS_ITERATOR_ERROR, { error });
};
export const profileCommentsIteratorSuccess = (data, request) =>
    action(types.PROFILE_COMMENTS_ITERATOR_SUCCESS, { data, request });

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

export const profileExists = akashaId => action(types.PROFILE_EXISTS, { akashaId });
export const profileExistsError = (error, request) => {
    error.code = 'PEE01';
    error.messageId = 'profileExists';
    return action(types.PROFILE_EXISTS_ERROR, { error, request });
};
export const profileExistsSuccess = data => action(types.PROFILE_EXISTS_SUCCESS, { data });

export const profileFaucet = ({ actionId, ethAddress, withNotification }) =>
    action(types.PROFILE_FAUCET, { actionId, ethAddress, withNotification });
export const profileFaucetError = (error, request) => {
    error.code = 'PFE02';
    error.messageId = 'profileFaucet';
    return action(types.PROFILE_FAUCET_ERROR, { error, request });
}
export const profileFaucetSuccess = (data, request) =>
    action(types.PROFILE_FAUCET_SUCCESS, { data, request });

export const profileFollow = ({ actionId, ethAddress }) =>
    action(types.PROFILE_FOLLOW, { actionId, ethAddress });
export const profileFollowSuccess = data => action(types.PROFILE_FOLLOW_SUCCESS, { data });
export const profileFollowError = (error, request) => {
    error.code = 'PFE01';
    error.messageId = 'profileFollow';
    error.values = { ethAddress: request.ethAddress };
    return action(types.PROFILE_FOLLOW_ERROR, { error, request });
};

export const profileFollowersIterator = ({ column, batching }) =>
    action(types.PROFILE_FOLLOWERS_ITERATOR, { column, batching });
export const profileFollowersIteratorError = (error, request) => {
    error.code = 'PFIE01';
    error.messageId = 'profileFollowersIterator';
    return action(types.PROFILE_FOLLOWERS_ITERATOR_ERROR, { error, request });
};
export const profileFollowersIteratorSuccess = (data, request, batching) =>
    action(types.PROFILE_FOLLOWERS_ITERATOR_SUCCESS, { data, request, batching });

export const profileFollowingsIterator = ({ column, limit, allFollowings, batching }) =>
    action(types.PROFILE_FOLLOWINGS_ITERATOR, { column, limit, allFollowings, batching });
export const profileFollowingsIteratorError = (error, request) => {
    error.code = 'PFIE02';
    error.messageId = 'profileFollowingsIterator';
    return action(types.PROFILE_FOLLOWINGS_ITERATOR_ERROR, { error, request });
};
export const profileFollowingsIteratorSuccess = (data, request, batching) =>
    action(types.PROFILE_FOLLOWINGS_ITERATOR_SUCCESS, { data, request, batching });

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

export const profileGetData = ({ akashaId, context, ethAddress, full, batching }) =>
    action(types.PROFILE_GET_DATA, { akashaId, context, ethAddress, full, batching });
export const profileGetDataError = (error, request) => {
    error.code = 'PGDE01';
    error.messageId = 'profileGetData';
    return action(types.PROFILE_GET_DATA_ERROR, { error, request, batching: request.batching });
};
export const profileGetDataSuccess = (data, request) =>
    action(types.PROFILE_GET_DATA_SUCCESS, { data, request, batching: request.batching });

export const profileGetEntrySyncBlockError = (error) => {
    error.code = 'PGESBE01';
    return action(types.PROFILE_GET_ENTRY_SYNC_BLOCK_ERROR, { error });
};

export const profileGetEntrySyncBlockSuccess = block =>
    action(types.PROFILE_GET_ENTRY_SYNC_BLOCK_SUCCESS, { block });

export const profileGetList = ethAddresses =>
    action(types.PROFILE_GET_LIST, { ethAddresses });

export const profileGetListError = (error) => {
    error.code = 'PGLE02';
    error.messageId = 'profileGetList';
    return action(types.PROFILE_GET_LIST_ERROR, { error });
};

export const profileGetListSuccess = data => action(types.PROFILE_GET_LIST_SUCCESS, { data });
export const profileGetLocal = polling => action(types.PROFILE_GET_LOCAL, { polling });

export const profileGetLocalError = (error, request) => {
    error.code = 'PGLE01';
    error.messageId = 'profileGetLocal';
    return action(types.PROFILE_GET_LOCAL_ERROR, { error, request });
};

export const profileGetLocalSuccess = (data, request) =>
    action(types.PROFILE_GET_LOCAL_SUCCESS, { data, request });
export const profileGetLogged = () => action(types.PROFILE_GET_LOGGED);

export const profileGetLoggedError = (error) => {
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

export const profileIsFollower = followings => action(types.PROFILE_IS_FOLLOWER, { followings });

export const profileIsFollowerError = (error, request) => {
    error.code = 'PIFE01';
    error.messageId = 'profileIsFollower';
    return action(types.PROFILE_IS_FOLLOWER_ERROR, { error, request });
};

export const profileIsFollowerSuccess = data =>
    action(types.PROFILE_IS_FOLLOWER_SUCCESS, { data });

export const profileKarmaRanking = () => action(types.PROFILE_KARMA_RANKING);
export const profileKarmaRankingError = (error) => {
    error.code = 'PKRE01';
    // error.messageId = 'profileKarmaRankingError';
    return action(types.PROFILE_KARMA_RANKING_ERROR);
};
export const profileKarmaRankingSuccess = data => action(types.PROFILE_KARMA_RANKING_SUCCESS, { data });
export const profileKarmaRankingLoadMore = data => action(types.PROFILE_KARMA_RANKING_LOAD_MORE, { data });

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

export const profileMoreCommentsIterator = column =>
    action(types.PROFILE_MORE_COMMENTS_ITERATOR, { column });
export const profileMoreCommentsIteratorError = (error, request) => {
    error.code = 'PMCIE01';
    error.messageId = 'profileMoreCommentsIterator';
    return action(types.PROFILE_MORE_COMMENTS_ITERATOR_ERROR, { error, request });
};
export const profileMoreCommentsIteratorSuccess = (data, request) =>
    action(types.PROFILE_MORE_COMMENTS_ITERATOR_SUCCESS, { data, request });

export const profileMoreFollowersIterator = ({ column, batching }) =>
    action(types.PROFILE_MORE_FOLLOWERS_ITERATOR, { column, batching });

export const profileMoreFollowersIteratorError = (error, request) => {
    error.code = 'PMFIE01';
    error.messageId = 'profileMoreFollowersIterator';
    return action(types.PROFILE_MORE_FOLLOWERS_ITERATOR_ERROR, { error, request });
};

export const profileMoreFollowersIteratorSuccess = (data, request) =>
    action(types.PROFILE_MORE_FOLLOWERS_ITERATOR_SUCCESS, { data, request });

export const profileMoreFollowingsIterator = ({ column, batching }) =>
    action(types.PROFILE_MORE_FOLLOWINGS_ITERATOR, { column, batching });

export const profileMoreFollowingsIteratorError = (error, request) => {
    error.code = 'PMFIE02';
    error.messageId = 'profileMoreFollowingsIterator';
    return action(types.PROFILE_MORE_FOLLOWINGS_ITERATOR_ERROR, { error, request });
};

export const profileMoreFollowingsIteratorSuccess = (data, request, batching) =>
    action(types.PROFILE_MORE_FOLLOWINGS_ITERATOR_SUCCESS, { data, request, batching });

export const profileRegister = ({
    actionId, akashaId, address, about, avatar, backgroundImage,
    donationsEnabled, firstName, lastName, links, ethAddress
}) =>
    action(types.PROFILE_REGISTER, {
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

export const profileRegisterError = (error, request) => {
    error.code = 'PRE01';
    error.messageId = 'profileRegister';
    return action(types.PROFILE_REGISTER_ERROR, { error, request });
};

export const profileRegisterSuccess = (data, request) =>
    action(types.PROFILE_REGISTER_SUCCESS, { data, request });

export const profileResetColumns = ethAddress => action(types.PROFILE_RESET_COLUMNS, { ethAddress });
export const profileResetEssenceEvents = () => action(types.PROFILE_RESET_ESSENCE_EVENTS);
export const profileResetFaucet = () => action(types.PROFILE_RESET_FAUCET);

export const profileResolveIpfsHash = (ipfsHash, columnId, akashaIds) =>
    action(types.PROFILE_RESOLVE_IPFS_HASH, { ipfsHash, columnId, akashaIds });

export const profileResolveIpfsHashError = (error, request) => {
    error.code = 'PRIHE01';
    error.messageId = 'profileResolveIpfsHash';
    return action(types.PROFILE_RESOLVE_IPFS_HASH_ERROR, { error, request });
};

export const profileResolveIpfsHashSuccess = (data, request) =>
    action(types.PROFILE_RESOLVE_IPFS_HASH_SUCCESS, { data, request });

export const profileSaveLastBlockNr = () => action(types.PROFILE_SAVE_LAST_BLOCK_NR);
export const profileSaveLastBlockNrError = (error) => {
    error.code = 'PSLBNE01';
    return action(types.PROFILE_SAVE_LAST_BLOCK_NR_ERROR, { error });
};

export const profileSaveLoggedError = (error) => {
    error.code = 'PSLE01';
    error.fatal = true;
    return action(types.PROFILE_SAVE_LOGGED_ERROR, { error });
};

export const profileSendTip = ({ actionId, akashaId, ethAddress, message, receiver, value, tokenAmount }) =>
    action(types.PROFILE_SEND_TIP, { actionId, akashaId, ethAddress, message, receiver, value, tokenAmount });

export const profileSendTipError = (error, request) => {
    error.code = 'PSTE01';
    error.messageId = 'profileSendTip';
    return action(types.PROFILE_SEND_TIP_ERROR, { error, request });
};

export const profileSendTipSuccess = data => action(types.PROFILE_SEND_TIP_SUCCESS, { data });

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

export const profileToggleDonationsSuccess = data =>
    action(types.PROFILE_TOGGLE_DONATIONS_SUCCESS, { data });

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
    error.values = { ethAddress: request.ethAddress };
    return action(types.PROFILE_UNFOLLOW_ERROR, { error, request });
};

export const profileUnfollowSuccess = data => action(types.PROFILE_UNFOLLOW_SUCCESS, { data });

export const profileUpdate = ({ actionId, about, avatar, backgroundImage, firstName, lastName, links }) =>
    action(types.PROFILE_UPDATE, { actionId, about, avatar, backgroundImage, firstName, lastName, links });

export const profileUpdateError = (error, request) => {
    error.code = 'PUE01';
    error.messageId = 'profileUpdate';
    return action(types.PROFILE_UPDATE_ERROR, { error, request });
};

export const profileUpdateSuccess = (data, request) =>
    action(types.PROFILE_UPDATE_SUCCESS, { data, request });


export const profileUpdateLoggedError = (error) => {
    error.code = 'PULE01';
    error.messageId = 'profileUpdateLogged';
    return action(types.PROFILE_UPDATE_LOGGED_ERROR, { error });
};

export const profileEssenceIterator = () =>
    action(types.PROFILE_ESSENCE_ITERATOR);

export const profileEssenceIteratorSuccess = (data, request) =>
    action(types.PROFILE_ESSENCE_ITERATOR_SUCCESS, { data, request });

export const profileEssenceIteratorError = (error, request) =>
    action(types.PROFILE_ESSENCE_ITERATOR_ERROR, { error, request });
