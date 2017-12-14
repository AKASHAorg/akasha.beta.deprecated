import { apply, call, fork, put, select, take, takeEvery, takeLatest } from 'redux-saga/effects';
import { reject, isNil } from 'ramda';
import { actionChannels, enableChannel, isLoggedProfileRequest } from './helpers';
import * as actionActions from '../actions/action-actions';
import * as appActions from '../actions/app-actions';
import * as entryActions from '../actions/entry-actions';
import * as actions from '../actions/profile-actions';
import * as searchActions from '../actions/search-actions';
import * as tempProfileActions from '../actions/temp-profile-actions';
import * as types from '../constants';
import * as profileService from '../services/profile-service';
import {
    selectBaseUrl, selectBlockNumber, selectEssenceIterator, selectLastFollower, selectLastFollowing,
    selectLoggedEthAddress, selectNeedAuthAction, selectProfileEditToggle, selectToken
} from '../selectors';
import * as actionStatus from '../../constants/action-status';
import * as actionTypes from '../../constants/action-types';
import { getDisplayName } from '../../utils/dataModule';

const Channel = global.Channel;
const TRANSFERS_ITERATOR_LIMIT = 20;
const FOLLOWERS_ITERATOR_LIMIT = 2;
const FOLLOWINGS_ITERATOR_LIMIT = 2;

function* profileAethTransfersIterator () {
    const channel = Channel.server.profile.transfersIterator;
    yield call(enableChannel, channel, Channel.client.profile.manager);
    const ethAddress = yield select(selectLoggedEthAddress);
    const toBlock = yield select(selectBlockNumber);
    yield apply(channel, channel.send, [{ ethAddress, toBlock, limit: TRANSFERS_ITERATOR_LIMIT }]);
}

function* profileEssenceIterator () {
    const channel = self.Channel.server.profile.essenceIterator;
    yield call(enableChannel, channel, Channel.client.profile.manager);
    const ethAddress = yield select(selectLoggedEthAddress);
    const essenceStep = yield select(selectEssenceIterator);
    const lastBlock = (essenceStep.lastBlock === null) ?
        yield select(selectBlockNumber) :
        essenceStep.lastBlock;
    yield apply(channel,
        channel.send,
        [reject(isNil, { ethAddress, lastBlock, lastIndex: essenceStep.lastIndex, limit: 16 })]);
}

function* profileBondAeth ({ actionId, amount }) {
    const channel = Channel.server.profile.bondAeth;
    yield call(enableChannel, channel, Channel.client.profile.manager);
    const token = yield select(selectToken);
    yield apply(channel, channel.send, [{ actionId, amount, token }]);
}

function* profileBondAethSuccess ({ data }) {
    yield put(appActions.showNotification({
        id: 'bondAethSuccess',
        duration: 4,
        values: { amount: data.amount },
    }));
}

function* profileCreateEthAddress ({ passphrase, passphrase1 }) {
    const channel = Channel.server.auth.generateEthKey;
    yield call(enableChannel, channel, Channel.client.auth.manager);
    yield apply(channel, channel.send, [{ password: passphrase, password1: passphrase1 }]);
}

function* profileCycleAeth ({ actionId, amount }) {
    const channel = Channel.server.profile.cycleAeth;
    yield call(enableChannel, channel, Channel.client.profile.manager);
    const token = yield select(selectToken);
    yield apply(channel, channel.send, [{ actionId, amount, token }]);
}

function* profileCycleAethSuccess ({ data }) {
    yield put(appActions.showNotification({
        id: 'cycleAethSuccess',
        duration: 4,
        values: { amount: data.amount },
    }));
}

function* profileCyclingStates () {
    const channel = Channel.server.profile.cyclingStates;
    yield call(enableChannel, channel, Channel.client.profile.manager);
    const ethAddress = yield select(selectLoggedEthAddress);
    yield apply(channel, channel.send, [{ ethAddress }]);
}

function* profileDeleteLogged () {
    try {
        yield apply(profileService, profileService.profileDeleteLogged);
        yield put(actions.profileDeleteLoggedSuccess());
    } catch (error) {
        yield put(actions.profileDeleteLoggedError());
    }
}

function* profileExists ({ akashaId }) {
    const channel = Channel.server.registry.profileExists;
    if (akashaId.length === 1) {
        yield put(actions.profileExistsSuccess({ akashaId, exists: false, idValid: false }));
    } else {
        yield call(enableChannel, channel, Channel.client.registry.manager);
        yield apply(channel, channel.send, [{ akashaId }]);
    }
}

function* profileFaucet ({ actionId, ethAddress }) {
    const channel = Channel.server.auth.requestEther;
    yield call(enableChannel, channel, Channel.client.auth.manager);
    yield apply(channel, channel.send, [{ address: ethAddress, actionId }]);
}

function* profileFollow ({ actionId, ethAddress }) {
    const channel = Channel.server.profile.followProfile;
    yield call(enableChannel, channel, Channel.client.profile.manager);
    const token = yield select(selectToken);
    yield apply(channel, channel.send, [{ token, actionId, ethAddress }]);
}

function* profileFollowSuccess ({ data }) {
    const displayName = getDisplayName(data);
    yield put(appActions.showNotification({
        id: 'followProfileSuccess',
        duration: 4,
        values: { displayName },
    }));
}

function* profileFollowersIterator ({ context, ethAddress }) {
    const channel = Channel.server.profile.followersIterator;
    yield call(enableChannel, channel, Channel.client.profile.manager);
    yield apply(channel, channel.send, [{ context, ethAddress, limit: FOLLOWERS_ITERATOR_LIMIT }]);
}

function* profileFollowingsIterator ({ context, ethAddress, limit = FOLLOWINGS_ITERATOR_LIMIT, entrySync }) {
    const channel = Channel.server.profile.followingIterator;
    yield call(enableChannel, channel, Channel.client.profile.manager);
    yield apply(
        channel,
        channel.send,
        [{ context, ethAddress, limit, entrySync }]
    );
}

function* profileFreeAeth ({ actionId, amount }) {
    const channel = Channel.server.profile.freeAeth;
    yield call(enableChannel, channel, Channel.client.profile.manager);
    const token = yield select(selectToken);
    yield apply(channel, channel.send, [{ actionId, amount, token }]);
}

function* profileFreeAethSuccess () {
    yield put(appActions.showNotification({ id: 'freeAethSuccess', duration: 4 }));
}

function* profileGetBalance ({ unit = 'ether' }) {
    const channel = Channel.server.profile.getBalance;
    const ethAddress = yield select(state => state.profileState.getIn(['loggedProfile', 'ethAddress']));
    if (!ethAddress) {
        return;
    }
    yield call(enableChannel, channel, Channel.client.profile.manager);
    yield apply(channel, channel.send, [{ etherBase: ethAddress, unit }]);
}

function* profileGetByAddress ({ ethAddress }) {
    const channel = Channel.server.registry.getByAddress;
    yield apply(channel, channel.send, [{ ethAddress }]);
}

function* profileGetData ({ akashaId, context, ethAddress, full = false }) {
    const channel = Channel.server.profile.getProfileData;
    yield apply(channel, channel.send, [{ akashaId, context, ethAddress, full }]);
}

export function* profileGetExtraOfList (collection, context) {
    const ethAddresses = [];
    collection.forEach((profile) => {
        const { ethAddress } = profile;
        if (ethAddress && !ethAddresses.includes(ethAddress)) {
            ethAddresses.push(ethAddress);
        }
    });
    for (let i = 0; i < ethAddresses.length; i++) {
        yield put(actions.profileGetData({ context, ethAddress: ethAddresses[i] }));
    }
    if (ethAddresses.length) {
        yield fork(profileIsFollower, { followings: ethAddresses });// eslint-disable-line
    }
}

function* profileGetList ({ ethAddresses }) {
    const channel = Channel.server.profile.getProfileList;
    yield call(enableChannel, channel, Channel.client.profile.manager);
    yield apply(channel, channel.send, [ethAddresses]);
}

function* profileGetLocal () {
    const channel = Channel.server.auth.getLocalIdentities;
    yield call(enableChannel, channel, Channel.client.auth.manager);
    yield apply(channel, channel.send, [{}]);
}

export function* profileGetLogged () {
    try {
        const loggedProfile = yield select(state => state.profileState.get('loggedProfile'));
        if (loggedProfile.get('ethAddress')) {
            return;
        }
        const profile = yield apply(profileService, profileService.profileGetLogged);
        yield put(actions.profileGetLoggedSuccess(profile));
        yield put(actions.profileGetBalance());
        if (profile && profile.ethAddress) {
            yield call(profileGetData, { ethAddress: profile.ethAddress, full: true });
        }
    } catch (error) {
        yield put(actions.profileGetLoggedError(error));
    }
}

function* profileIsFollower ({ followings, ethAddress }) {
    const channel = Channel.server.profile.isFollower;
    yield call(enableChannel, channel, Channel.client.profile.manager);
    if (!ethAddress) {
        ethAddress = yield select(selectLoggedEthAddress);
    }
    const payload = followings.map(following => (
        { ethAddressFollower: ethAddress, ethAddressFollowing: following }
    ));
    yield apply(channel, channel.send, [payload]);
}

function* profileLogin ({ data }) {
    yield fork(watchProfileLoginChannel); // eslint-disable-line no-use-before-define
    const { ...payload } = data;
    const channel = Channel.server.auth.login;
    payload.password = new global.TextEncoder('utf-8').encode(payload.password);
    yield apply(channel, channel.send, [payload]);
}

function* profileLogout () {
    const channel = Channel.server.auth.logout;
    yield apply(channel, channel.send, [{}]);
}

function* profileManaBurned () {
    const channel = Channel.server.profile.manaBurned;
    yield call(enableChannel, channel, Channel.client.profile.manager);
    const ethAddress = yield select(selectLoggedEthAddress);
    yield apply(channel, channel.send, [{ ethAddress }]);
}

function* profileMoreFollowersIterator ({ ethAddress }) {
    const channel = Channel.server.profile.followersIterator;
    const last = yield select(state => selectLastFollower(state, ethAddress));
    const payload = {
        ethAddress,
        limit: FOLLOWERS_ITERATOR_LIMIT,
        lastBlock: last.lastBlock,
        lastIndex: last.lastIndex
    };
    yield apply(channel, channel.send, [payload]);
}

function* profileMoreFollowingsIterator ({ ethAddress }) {
    const channel = Channel.server.profile.followingIterator;
    const last = yield select(state => selectLastFollowing(state, ethAddress));
    const payload = {
        ethAddress,
        limit: FOLLOWINGS_ITERATOR_LIMIT,
        lastBlock: last.lastBlock,
        lastIndex: last.lastIndex
    };
    yield apply(channel, channel.send, [payload]);
}

function* profileResolveIpfsHash ({ ipfsHash, columnId, akashaIds }) {
    const channel = Channel.server.profile.resolveProfileIpfsHash;
    yield call(enableChannel, channel, Channel.client.profile.manager);
    yield apply(channel, channel.send, [{ ipfsHash, columnId, akashaIds }]);
}

function* profileSaveLogged (loggedProfile) {
    try {
        yield apply(profileService, profileService.profileSaveLogged, [loggedProfile]);
    } catch (error) {
        yield put(actions.profileSaveLoggedError(error));
    }
}

function* profileSendTip ({ actionId, akashaId, ethAddress, receiver, value }) {
    const channel = Channel.server.profile.tip;
    yield call(enableChannel, channel, Channel.client.profile.manager);
    const token = yield select(selectToken);
    yield apply(channel, channel.send, [{
        token,
        actionId,
        akashaId,
        ethAddress,
        receiver,
        value
    }]);
}

function* profileSendTipSuccess ({ data }) {
    const displayName = getDisplayName(data);
    yield put(appActions.showNotification({
        id: 'sendTipSuccess',
        duration: 4,
        values: { displayName },
    }));
}

function* profileToggleDonations ({ actionId, status }) {
    const channel = Channel.server.profile.toggleDonations;
    yield call(enableChannel, channel, Channel.client.profile.manager);
    const token = yield select(selectToken);
    yield apply(channel, channel.send, [{ token, actionId, status }]);
}

function* profileToggleDonationsSuccess () {
    const profile = yield apply(profileService, profileService.profileGetLogged);
    if (profile && profile.ethAddress) {
        yield call(profileGetData, { ethAddress: profile.ethAddress, full: true });
    }
    yield put(appActions.showNotification({
        id: 'toggleDonationsSuccess',
        duration: 4
    }));
}

function* profileTransferAeth ({ actionId, akashaId, ethAddress, tokenAmount }) {
    const channel = Channel.server.profile.transfer;
    yield call(enableChannel, channel, Channel.client.profile.manager);
    const token = yield select(selectToken);
    yield apply(channel, channel.send, [{ token, actionId, akashaId, ethAddress, tokenAmount }]);
}

function* profileTransferAethSuccess ({ data }) {
    const displayName = getDisplayName(data);
    yield put(appActions.showNotification({
        id: 'transferAethSuccess',
        duration: 4,
        values: { displayName, tokenAmount: data.tokenAmount },
    }));
}

function* profileTransferEth ({ actionId, akashaId, ethAddress, value }) {
    const channel = Channel.server.profile.transfer;
    yield call(enableChannel, channel, Channel.client.profile.manager);
    const token = yield select(selectToken);
    yield apply(channel, channel.send, [{ token, actionId, akashaId, ethAddress, value }]);
}

function* profileTransferEthSuccess ({ data }) {
    const displayName = getDisplayName(data);
    yield put(appActions.showNotification({
        id: 'transferEthSuccess',
        duration: 4,
        values: { displayName, value: data.value },
    }));
}

function* profileTransformEssence ({ actionId, amount }) {
    const channel = Channel.server.profile.transformEssence;
    yield call(enableChannel, channel, Channel.client.profile.manager);
    const token = yield select(selectToken);
    yield apply(channel, channel.send, [{ actionId, amount, token }]);
}

function* profileTransformEssenceSuccess ({ data }) {
    yield put(appActions.showNotification({
        id: 'transformEssenceSuccess',
        duration: 4,
        values: { amount: data.amount },
    }));
}

function* profileUnfollow ({ actionId, ethAddress }) {
    const channel = Channel.server.profile.unFollowProfile;
    yield call(enableChannel, channel, Channel.client.profile.manager);
    const token = yield select(selectToken);
    yield apply(channel, channel.send, [{ token, actionId, ethAddress }]);
}

function* profileUnfollowSuccess ({ data }) {
    const displayName = getDisplayName(data);
    yield put(appActions.showNotification({
        id: 'unfollowProfileSuccess',
        duration: 4,
        values: { displayName },
    }));
}

function* profileUpdate ({ actionId, about, avatar, backgroundImage, firstName, lastName, links }) {
    const isProfileEdit = select(selectProfileEditToggle);
    if (isProfileEdit) {
        yield put(appActions.profileEditToggle());
    }
    const channel = Channel.server.profile.updateProfileData;
    yield call(enableChannel, channel, Channel.client.profile.manager);
    const token = yield select(selectToken);
    const ipfs = { about, avatar, backgroundImage, firstName, lastName, links };
    yield apply(channel, channel.send, [{ token, actionId, ipfs }]);
}

function* profileUpdateSuccess (payload) {
    const { akashaId, ethAddress } = payload.data;
    // remove saved temp profile from DB and clear tempProfileState
    yield put(tempProfileActions.tempProfileDelete(ethAddress));
    // get updated profile data
    yield call(profileGetData, { akashaId, full: true });
    yield put(appActions.showNotification({
        id: 'updateProfileSuccess',
        duration: 4,
    }));
}

function* profileUpdateLogged (loggedProfile) {
    try {
        yield apply(profileService, profileService.profileUpdateLogged, [loggedProfile]);
    } catch (error) {
        yield put(actions.profileUpdateLoggedError(error));
    }
}

function* profileRegister ({ actionId, akashaId, address, about, avatar, backgroundImage, donationsEnabled,
    firstName, lastName, links, ethAddress }) {
    const isProfileEdit = select(selectProfileEditToggle);
    if (isProfileEdit) {
        yield put(appActions.profileEditToggle());
    }
    const channel = Channel.server.registry.registerProfile;
    yield call(enableChannel, channel, Channel.client.registry.manager);
    const token = yield select(selectToken);
    const ipfs = { avatar, address, about, backgroundImage, firstName, lastName, links };
    yield apply(channel, channel.send, [{ token, actionId, akashaId, donationsEnabled, ethAddress, ipfs }]);
}

function* profileRegisterSuccess (payload) {
    const { akashaId, ethAddress } = payload.data;
    // remove saved temp profile from DB and clear tempProfileState
    yield put(tempProfileActions.tempProfileDelete(ethAddress));
    // get updated profile data
    yield call(profileGetData, { akashaId, full: true });
    yield put(appActions.showNotification({
        id: 'registerProfileSuccess',
        duration: 4,
    }));
}


// Channel watchers

function* watchProfileAethTransfersIteratorChannel () {
    while (true) {
        const resp = yield take(actionChannels.profile.transfersIterator);
        if (resp.error) {
            yield put(actions.profileAethTransfersIteratorError(resp.error));
        } else {
            yield put(actions.profileAethTransfersIteratorSuccess(resp.data));
        }
    }
}

function* watchProfileEssenceIteratorChannel () {
    while (true) {
        const resp = yield take(actionChannels.profile.essenceIterator);
        if (resp.error) {
            yield put(actions.profileEssenceIteratorError(resp.error));
        } else {
            const entries = yield select(state => state.entryState.get('byId'));
            const entryEvents = ['entry:claim', 'entry:vote:claim'];
            const { collection } = resp.data;
            for (let i = 0; i < collection.length; i++) {
                const { action, sourceId } = collection[i];
                if (entryEvents.indexOf(action) !== -1 && !entries.get(sourceId)) {
                    yield put(entryActions.entryGetShort({ context: 'essenceEvents', entryId: sourceId }));
                }
            }
            yield put(actions.profileEssenceIteratorSuccess(resp.data));
        }
    }
}

function* watchProfileBondAethChannel () {
    while (true) {
        const resp = yield take(actionChannels.profile.bondAeth);
        const { actionId } = resp.request;
        const shouldApplyChanges = yield call(isLoggedProfileRequest, actionId);
        if (shouldApplyChanges) {
            if (resp.error) {
                yield put(actions.profileBondAethError(resp.error, resp.request.amount));
                yield put(actionActions.actionDelete(actionId));
            } else if (resp.data.receipt) {
                yield put(actionActions.actionPublished(resp.data.receipt));
                if (!resp.data.receipt.success) {
                    yield put(actions.profileBondAethError(resp.error, resp.request.amount));
                }
            } else {
                const changes = { id: actionId, status: actionStatus.publishing, tx: resp.data.tx };
                yield put(actionActions.actionUpdate(changes));
            }
        }
    }
}

function* watchProfileCreateEthAddressChannel () {
    while (true) {
        const resp = yield take(actionChannels.auth.generateEthKey);
        if (resp.error) {
            yield put(actions.profileCreateEthAddressError(resp.error));
        } else {
            yield put(actions.profileCreateEthAddressSuccess(resp.data));
            const ethAddress = resp.data.address;
            const { password } = resp.request;
            yield put(actions.profileLogin({ ethAddress, password }));
            // request funds from faucet
            yield put(actionActions.actionAdd(ethAddress, actionTypes.faucet, { ethAddress }));
        }
    }
}

function* watchProfileCycleAethChannel () {
    while (true) {
        const resp = yield take(actionChannels.profile.cycleAeth);
        const { actionId } = resp.request;
        const shouldApplyChanges = yield call(isLoggedProfileRequest, actionId);
        if (shouldApplyChanges) {
            if (resp.error) {
                yield put(actions.profileCycleAethError(resp.error, resp.request.amount));
                yield put(actionActions.actionDelete(actionId));
            } else if (resp.data.receipt) {
                yield put(actionActions.actionPublished(resp.data.receipt));
                if (!resp.data.receipt.success) {
                    yield put(actions.profileCycleAethError({}, resp.request.amount));
                }
            } else {
                const changes = { id: actionId, status: actionStatus.publishing, tx: resp.data.tx };
                yield put(actionActions.actionUpdate(changes));
            }
        }
    }
}

function* watchProfileCyclingStatesChannel () {
    while (true) {
        const resp = yield take(actionChannels.profile.cyclingStates);
        if (resp.error) {
            yield put(actions.profileCyclingStatesError(resp.error));
        } else {
            yield put(actions.profileCyclingStatesSuccess(resp.data));
        }
    }
}

function* watchProfileExistsChannel () {
    while (true) {
        const resp = yield take(actionChannels.registry.profileExists);
        if (resp.error) {
            yield put(actions.profileExistsError(resp.error, resp.request));
        } else {
            yield put(actions.profileExistsSuccess(resp.data));
        }
    }
}

function* watchProfileFaucetChannel () {
    while (true) {
        const resp = yield take(actionChannels.auth.requestEther);
        const { actionId } = resp.request;
        const shouldApplyChanges = yield call(isLoggedProfileRequest, actionId);
        if (true) {
            if (resp.error) {
                yield put(actions.profileFaucetError(resp.error, resp.request));
            } else if (resp.data.receipt) {
                yield put(actionActions.actionPublished(resp.data.receipt));
                if (!resp.data.receipt.success) {
                    yield put(actions.profileFaucetError({}));
                }
            } else {
                const changes = { id: actionId, status: actionStatus.publishing, tx: resp.data.tx };
                yield put(actionActions.actionUpdate(changes));
            }
        }
    }
}

function* watchProfileFollowChannel () {
    while (true) {
        const resp = yield take(actionChannels.profile.followProfile);
        const { actionId } = resp.request;
        const shouldApplyChanges = yield call(isLoggedProfileRequest, actionId);
        if (shouldApplyChanges) {
            if (resp.error) {
                yield put(actions.profileFollowError(resp.error, resp.request));
                yield put(actionActions.actionDelete(actionId));
            } else if (resp.data.receipt) {
                yield put(actionActions.actionPublished(resp.data.receipt));
            } else {
                const changes = { id: actionId, status: actionStatus.publishing, tx: resp.data.tx };
                yield put(actionActions.actionUpdate(changes));
            }
        }
    }
}

function* watchProfileFollowersIteratorChannel () {
    while (true) {
        const resp = yield take(actionChannels.profile.followersIterator);
        if (resp.error) {
            if (resp.request.lastBlock) {
                yield put(actions.profileMoreFollowersIteratorError(resp.error, resp.request));
            } else {
                yield put(actions.profileFollowersIteratorError(resp.error, resp.request));
            }
        } else {
            yield call(profileGetExtraOfList, resp.data.collection, resp.request.context);
            if (resp.request.lastBlock) {
                yield put(actions.profileMoreFollowersIteratorSuccess(resp.data, resp.request));
            } else {
                yield put(actions.profileFollowersIteratorSuccess(resp.data, resp.request));
            }
        }
    }
}

function* watchProfileFollowingsIteratorChannel () {
    while (true) {
        const resp = yield take(actionChannels.profile.followingIterator);
        if (resp.error) {
            if (resp.request.lastBlock) {
                yield put(actions.profileMoreFollowingsIteratorError(resp.error, resp.request));
            } else {
                yield put(actions.profileFollowingsIteratorError(resp.error, resp.request));
            }
        } else if (resp.request.entrySync) {
            const followings = resp.data.collection.map(profile => profile.ethAddress);
            yield put(searchActions.searchSyncEntries(followings));
        } else {
            yield call(profileGetExtraOfList, resp.data.collection, resp.request.context);
            if (resp.request.lastBlock) {
                yield put(actions.profileMoreFollowingsIteratorSuccess(resp.data, resp.request));
            } else {
                yield put(actions.profileFollowingsIteratorSuccess(resp.data, resp.request));
            }
        }
    }
}

function* watchProfileFreeAethChannel () {
    while (true) {
        const resp = yield take(actionChannels.profile.freeAeth);
        const { actionId } = resp.request;
        const shouldApplyChanges = yield call(isLoggedProfileRequest, actionId);
        if (shouldApplyChanges) {
            if (resp.error) {
                yield put(actions.profileFreeAethError(resp.error));
                yield put(actionActions.actionDelete(actionId));
            } else if (resp.data.receipt) {
                yield put(actionActions.actionPublished(resp.data.receipt));
                if (!resp.data.receipt.success) {
                    yield put(actions.profileFreeAethError({}));
                } else {
                    yield put(actions.profileCyclingStates());
                }
            } else {
                const changes = { id: actionId, status: actionStatus.publishing, tx: resp.data.tx };
                yield put(actionActions.actionUpdate(changes));
            }
        }
    }
}

function* watchProfileGetBalanceChannel () {
    while (true) {
        const resp = yield take(actionChannels.profile.getBalance);
        if (resp.error) {
            yield put(actions.profileGetBalanceError(resp.error));
        } else {
            yield put(actions.profileGetBalanceSuccess(resp.data));
        }
    }
}

function* watchProfileGetByAddressChannel () {
    while (true) {
        const resp = yield take(actionChannels.registry.getByAddress);
        if (resp.error) {
            yield put(actions.profileGetByAddressError(resp.error));
        } else {
            yield put(actions.profileGetByAddressSuccess(resp.data));
            const { akashaId } = resp.data;
            if (akashaId) {
                yield put(actions.profileGetData({ akashaId, full: true }));
            } else {
                yield put(actions.isFollower(resp.data.ethAddress));
            }
        }
    }
}

function* watchProfileGetDataChannel () {
    while (true) {
        const resp = yield take(actionChannels.profile.getProfileData);
        if (resp.error) {
            yield put(actions.profileGetDataError(resp.error, resp.request));
        } else {
            yield put(actions.profileGetDataSuccess(resp.data, resp.request));
        }
    }
}

function* watchProfileGetLocalChannel () {
    while (true) {
        const resp = yield take(actionChannels.auth.getLocalIdentities);
        if (resp.error) {
            yield put(actions.profileGetLocalError(resp.error));
        } else {
            const akashaIds = [];
            resp.data.collection.forEach((data) => {
                if (data.akashaId) {
                    akashaIds.push({ akashaId: data.akashaId });
                }
            });
            if (akashaIds.length) {
                yield put(actions.profileGetList(akashaIds));
            }
            yield put(actions.profileGetLocalSuccess(resp.data.collection));
        }
    }
}

function* watchProfileGetListChannel () {
    while (true) {
        const resp = yield take(actionChannels.profile.getProfileList);
        if (resp.error) {
            yield put(actions.profileGetListError(resp.error));
        } else {
            yield put(actions.profileGetListSuccess(resp.data));
        }
    }
}

function* watchProfileIsFollowerChannel () {
    while (true) {
        const resp = yield take(actionChannels.profile.isFollower);
        if (resp.error) {
            yield put(actions.profileIsFollowerError(resp.error, resp.request));
        } else {
            yield put(actions.profileIsFollowerSuccess(resp.data));
        }
    }
}

function* watchProfileLoginChannel () {
    const resp = yield take(actionChannels.auth.login);
    if (resp.error) {
        yield put(actions.profileLoginError(resp.error));
    } else if (resp.request.account === resp.data.account) {
        const { akashaId, ethAddress, reauthenticate } = resp.request;
        if (!reauthenticate && akashaId) {
            resp.data.akashaId = akashaId;
        }
        yield put(actions.profileLoginSuccess(resp.data));
        if (reauthenticate) {
            const needAuthAction = yield select(selectNeedAuthAction);
            yield call(profileUpdateLogged, resp.data);
            if (needAuthAction) {
                yield put(actionActions.actionPublish(needAuthAction.get('id')));
            }
        } else {
            yield call(profileGetData, { ethAddress, full: true });
            yield call(profileSaveLogged, resp.data);
        }
        yield put(actions.profileGetBalance());
    }
}

function* watchProfileLogoutChannel () {
    while (true) {
        const resp = yield take(actionChannels.auth.logout);
        if (resp.error) {
            yield put(actions.profileLogoutError(resp.error));
        } else {
            yield call(profileDeleteLogged);
            yield put(actions.profileLogoutSuccess());
        }
    }
}

function* watchProfileManaBurnedChannel () {
    while (true) {
        const resp = yield take(actionChannels.profile.manaBurned);
        if (resp.error) {
            yield put(actions.profileManaBurnedError(resp.error));
        } else {
            yield put(actions.profileManaBurnedSuccess(resp.data));
        }
    }
}

function* watchProfileRegisterChannel () {
    while (true) {
        const resp = yield take(actionChannels.registry.registerProfile);
        const { actionId } = resp.request;
        const shouldApplyChanges = yield call(isLoggedProfileRequest, actionId);
        if (shouldApplyChanges) {
            if (resp.error) {
                yield put(actions.profileRegisterError(resp.error, resp.request));
            } else if (resp.data.receipt) {
                yield put(actionActions.actionPublished(resp.data.receipt));
                if (!resp.data.receipt.success) {
                    yield put(actions.profileRegisterError({}));
                }
            } else {
                const changes = { id: actionId, status: actionStatus.publishing, tx: resp.data.tx };
                yield put(actionActions.actionUpdate(changes));
            }
        }
    }
}

function* watchProfileResolveIpfsHashChannel () {
    while (true) {
        const resp = yield take(actionChannels.profile.resolveProfileIpfsHash);
        if (resp.error) {
            yield put(actions.profileResolveIpfsHashError(resp.error, resp.request));
        } else if (resp.data.profile) {
            const baseUrl = yield select(selectBaseUrl);
            if (resp.data.profile.avatar) {
                resp.data.profile.avatar = `${baseUrl}/${resp.data.profile.avatar}`;
            }
            yield put(actions.profileResolveIpfsHashSuccess(resp.data, resp.request));
        }
    }
}

function* watchProfileSendTipChannel () {
    while (true) {
        const resp = yield take(actionChannels.profile.tip);
        const { actionId } = resp.request;
        const shouldApplyChanges = yield call(isLoggedProfileRequest, actionId);
        if (shouldApplyChanges) {
            if (resp.error) {
                yield put(actions.profileSendTipError(resp.error, resp.request));
                yield put(actionActions.actionDelete(actionId));
            } else if (resp.data.receipt) {
                yield put(actionActions.actionPublished(resp.data.receipt));
            } else {
                const changes = { id: actionId, status: actionStatus.publishing, tx: resp.data.tx };
                yield put(actionActions.actionUpdate(changes));
            }
        }
    }
}

function* watchProfileToggleDonationsChannel () {
    while (true) {
        const resp = yield take(actionChannels.profile.toggleDonations);
        const { actionId } = resp.request;
        if (resp.error) {
            yield put(actions.profileToggleDonationsError(resp.error, resp.request));
        } else if (resp.data.receipt) {
            yield put(actionActions.actionPublished(resp.data.receipt));
            if (!resp.data.receipt.success) {
                yield put(actions.profileToggleDonationsError({}, resp.request));
            }
        } else {
            const changes = { id: actionId, status: actionStatus.publishing, tx: resp.data.tx };
            yield put(actionActions.actionUpdate(changes));
        }
    }
}

function* watchProfileTransferChannel () {
    while (true) {
        const resp = yield take(actionChannels.profile.transfer);
        const { actionId, tokenAmount } = resp.request;
        const shouldApplyChanges = yield call(isLoggedProfileRequest, actionId);
        if (shouldApplyChanges) {
            if (resp.error) {
                if (tokenAmount) {
                    yield put(actions.profileTransferAethError(resp.error, resp.request));
                } else {
                    yield put(actions.profileTransferEthError(resp.error, resp.request));
                }
            } else if (resp.data.receipt) {
                yield put(actionActions.actionPublished(resp.data.receipt));
                if (!resp.data.receipt.success) {
                    if (tokenAmount) {
                        yield put(actions.profileTransferAethError({}, resp.request));
                    } else {
                        yield put(actions.profileTransferEthError({}, resp.request));
                    }
                }
            } else {
                const changes = { id: actionId, status: actionStatus.publishing, tx: resp.data.tx };
                yield put(actionActions.actionUpdate(changes));
            }
        }
    }
}

function* watchProfileTransformEssenceChannel () {
    while (true) {
        const resp = yield take(actionChannels.profile.transformEssence);
        const { actionId } = resp.request;
        const shouldApplyChanges = yield call(isLoggedProfileRequest, actionId);
        if (shouldApplyChanges) {
            if (resp.error) {
                yield put(actions.profileTransformEssenceError(resp.error, resp.request.amount));
                yield put(actionActions.actionDelete(actionId));
            } else if (resp.data.receipt) {
                yield put(actionActions.actionPublished(resp.data.receipt));
                if (!resp.data.receipt.success) {
                    yield put(actions.profileTransformEssenceError({}, resp.request.amount));
                }
            } else {
                const changes = { id: actionId, status: actionStatus.publishing, tx: resp.data.tx };
                yield put(actionActions.actionUpdate(changes));
            }
        }
    }
}

function* watchProfileUnfollowChannel () {
    while (true) {
        const resp = yield take(actionChannels.profile.unFollowProfile);
        const { actionId } = resp.request;
        const shouldApplyChanges = yield call(isLoggedProfileRequest, actionId);
        if (shouldApplyChanges) {
            if (resp.error) {
                yield put(actions.profileUnfollowError(resp.error, resp.request));
                yield put(actionActions.actionDelete(actionId));
            } else if (resp.data.receipt) {
                yield put(actionActions.actionPublished(resp.data.receipt));
            } else {
                const changes = { id: actionId, status: actionStatus.publishing, tx: resp.data.tx };
                yield put(actionActions.actionUpdate(changes));
            }
        }
    }
}

function* watchProfileUpdateChannel () {
    while (true) {
        const resp = yield take(actionChannels.profile.updateProfileData);
        const { actionId } = resp.request;
        const shouldApplyChanges = yield call(isLoggedProfileRequest, actionId);
        if (shouldApplyChanges) {
            if (resp.error) {
                yield put(actions.profileUpdateError(resp.error, resp.request));
            } else if (resp.data.receipt) {
                yield put(actionActions.actionPublished(resp.data.receipt));
                if (!resp.data.receipt.success) {
                    yield put(actions.profileUpdateError({}));
                }
            } else {
                const changes = { id: actionId, status: actionStatus.publishing, tx: resp.data.tx };
                yield put(actionActions.actionUpdate(changes));
            }
        }
    }
}

export function* registerProfileListeners () { // eslint-disable-line max-statements
    yield fork(watchProfileEssenceIteratorChannel);
    yield fork(watchProfileAethTransfersIteratorChannel);
    yield fork(watchProfileBondAethChannel);
    yield fork(watchProfileCreateEthAddressChannel);
    yield fork(watchProfileCycleAethChannel);
    yield fork(watchProfileCyclingStatesChannel);
    yield fork(watchProfileExistsChannel);
    yield fork(watchProfileFollowChannel);
    yield fork(watchProfileFollowersIteratorChannel);
    yield fork(watchProfileFollowingsIteratorChannel);
    yield fork(watchProfileFreeAethChannel);
    yield fork(watchProfileGetBalanceChannel);
    yield fork(watchProfileGetByAddressChannel);
    yield fork(watchProfileGetDataChannel);
    yield fork(watchProfileGetLocalChannel);
    yield fork(watchProfileGetListChannel);
    yield fork(watchProfileIsFollowerChannel);
    yield fork(watchProfileLogoutChannel);
    yield fork(watchProfileManaBurnedChannel);
    yield fork(watchProfileFaucetChannel);
    yield fork(watchProfileResolveIpfsHashChannel);
    yield fork(watchProfileSendTipChannel);
    yield fork(watchProfileToggleDonationsChannel);
    yield fork(watchProfileTransferChannel);
    yield fork(watchProfileTransformEssenceChannel);
    yield fork(watchProfileUnfollowChannel);
    yield fork(watchProfileUpdateChannel);
    yield fork(watchProfileRegisterChannel);
}

export function* watchProfileActions () { // eslint-disable-line max-statements
    yield takeEvery(types.PROFILE_AETH_TRANSFERS_ITERATOR, profileAethTransfersIterator);
    yield takeEvery(types.PROFILE_BOND_AETH, profileBondAeth);
    yield takeEvery(types.PROFILE_BOND_AETH_SUCCESS, profileBondAethSuccess);
    yield takeLatest(types.PROFILE_CREATE_ETH_ADDRESS, profileCreateEthAddress);
    yield takeEvery(types.PROFILE_CYCLE_AETH, profileCycleAeth);
    yield takeEvery(types.PROFILE_CYCLE_AETH_SUCCESS, profileCycleAethSuccess);
    yield takeEvery(types.PROFILE_CYCLING_STATES, profileCyclingStates);
    yield takeLatest(types.PROFILE_DELETE_LOGGED, profileDeleteLogged);
    yield takeEvery(types.PROFILE_ESSENCE_ITERATOR, profileEssenceIterator);
    yield takeLatest(types.PROFILE_EXISTS, profileExists);
    yield takeEvery(types.PROFILE_FAUCET, profileFaucet);
    yield takeEvery(types.PROFILE_FOLLOW, profileFollow);
    yield takeEvery(types.PROFILE_FOLLOW_SUCCESS, profileFollowSuccess);
    yield takeEvery(types.PROFILE_FOLLOWERS_ITERATOR, profileFollowersIterator);
    yield takeEvery(types.PROFILE_FOLLOWINGS_ITERATOR, profileFollowingsIterator);
    yield takeEvery(types.PROFILE_FREE_AETH, profileFreeAeth);
    yield takeEvery(types.PROFILE_FREE_AETH_SUCCESS, profileFreeAethSuccess);
    yield takeLatest(types.PROFILE_GET_BALANCE, profileGetBalance);
    yield takeEvery(types.PROFILE_GET_BY_ADDRESS, profileGetByAddress);
    yield takeEvery(types.PROFILE_GET_DATA, profileGetData);
    yield takeLatest(types.PROFILE_GET_LIST, profileGetList);
    yield takeLatest(types.PROFILE_GET_LOCAL, profileGetLocal);
    yield takeLatest(types.PROFILE_GET_LOGGED, profileGetLogged);
    yield takeEvery(types.PROFILE_IS_FOLLOWER, profileIsFollower);
    yield takeLatest(types.PROFILE_LOGIN, profileLogin);
    yield takeLatest(types.PROFILE_LOGOUT, profileLogout);
    yield takeEvery(types.PROFILE_MANA_BURNED, profileManaBurned);
    yield takeEvery(types.PROFILE_MORE_FOLLOWERS_ITERATOR, profileMoreFollowersIterator);
    yield takeEvery(types.PROFILE_MORE_FOLLOWINGS_ITERATOR, profileMoreFollowingsIterator);
    yield takeEvery(types.PROFILE_RESOLVE_IPFS_HASH, profileResolveIpfsHash);
    yield takeEvery(types.PROFILE_SEND_TIP, profileSendTip);
    yield takeEvery(types.PROFILE_SEND_TIP_SUCCESS, profileSendTipSuccess);
    yield takeEvery(types.PROFILE_TOGGLE_DONATIONS, profileToggleDonations);
    yield takeEvery(types.PROFILE_TOGGLE_DONATIONS_SUCCESS, profileToggleDonationsSuccess);
    yield takeEvery(types.PROFILE_TRANSFER_AETH, profileTransferAeth);
    yield takeEvery(types.PROFILE_TRANSFER_AETH_SUCCESS, profileTransferAethSuccess);
    yield takeEvery(types.PROFILE_TRANSFER_ETH, profileTransferEth);
    yield takeEvery(types.PROFILE_TRANSFER_ETH_SUCCESS, profileTransferEthSuccess);
    yield takeEvery(types.PROFILE_TRANSFORM_ESSENCE, profileTransformEssence);
    yield takeEvery(types.PROFILE_TRANSFORM_ESSENCE_SUCCESS, profileTransformEssenceSuccess);
    yield takeEvery(types.PROFILE_UNFOLLOW, profileUnfollow);
    yield takeEvery(types.PROFILE_UNFOLLOW_SUCCESS, profileUnfollowSuccess);
    yield takeEvery(types.PROFILE_UPDATE, profileUpdate);
    yield takeEvery(types.PROFILE_UPDATE_SUCCESS, profileUpdateSuccess);
    yield takeEvery(types.PROFILE_REGISTER, profileRegister);
    yield takeEvery(types.PROFILE_REGISTER_SUCCESS, profileRegisterSuccess);
}

export function* registerWatchers () {
    yield fork(registerProfileListeners);
    yield fork(watchProfileActions);
}
