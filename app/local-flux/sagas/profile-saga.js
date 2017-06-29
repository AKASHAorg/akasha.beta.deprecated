import { apply, call, fork, put, select, take, takeEvery, takeLatest } from 'redux-saga/effects';
import { actionChannels, enableChannel } from './helpers';
import * as appActions from '../actions/app-actions';
import * as actions from '../actions/profile-actions';
import * as transactionActions from '../actions/transaction-actions';
import * as types from '../constants';
import * as profileService from '../services/profile-service';
import { selectBaseUrl, selectLastFollower, selectLastFollowing, selectLoggedAkashaId,
    selectToken } from '../selectors';
import actionTypes from '../../constants/action-types';

const Channel = global.Channel;
const FOLLOWERS_ITERATOR_LIMIT = 13;
const FOLLOWINGS_ITERATOR_LIMIT = 13;

function* profileDeleteLogged () {
    try {
        yield apply(profileService, profileService.profileDeleteLogged);
        yield put(actions.profileDeleteLoggedSuccess());
    } catch (error) {
        yield put(actions.profileDeleteLoggedError());
    }
}

function* profileFollow ({ akashaId, gas, profile }) {
    const channel = Channel.server.profile.followProfile;
    yield call(enableChannel, channel, Channel.client.profile.manager);
    const token = yield select(selectToken);
    yield apply(channel, channel.send, [{ token, akashaId, gas, profile }]);
}

function* profileFollowersIterator ({ akashaId }) {
    const channel = Channel.server.profile.followersIterator;
    yield call(enableChannel, channel, Channel.client.profile.manager);
    yield apply(channel, channel.send, [{ akashaId, limit: FOLLOWERS_ITERATOR_LIMIT }]);
}

function* profileFollowingsIterator ({ akashaId }) {
    const channel = Channel.server.profile.followingIterator;
    yield call(enableChannel, channel, Channel.client.profile.manager);
    yield apply(channel, channel.send, [{ akashaId, limit: FOLLOWINGS_ITERATOR_LIMIT }]);
}

function* profileGetBalance ({ unit = 'ether' }) {
    const channel = Channel.server.profile.getBalance;
    const account = yield select(state => state.profileState.getIn(['loggedProfile', 'account']));
    if (!account) {
        return;
    }
    yield call(enableChannel, channel, Channel.client.profile.manager);
    yield apply(channel, channel.send, [{ etherBase: account, unit }]);
}

export function* profileGetCurrent () {
    const channel = Channel.server.registry.getCurrentProfile;
    yield apply(channel, channel.send, [{}]);
}

function* profileGetData (profile, full = false) {
    const channel = Channel.server.profile.getProfileData;
    yield apply(channel, channel.send, [{ profile, full }]);
}

function* profileGetList ({ profileAddresses }) {
    const channel = Channel.server.profile.getProfileList;
    yield call(enableChannel, channel, Channel.client.profile.manager);
    yield apply(channel, channel.send, [profileAddresses]);
}

function* profileGetLocal () {
    const channel = Channel.server.auth.getLocalIdentities;
    yield call(enableChannel, channel, Channel.client.auth.manager);
    yield apply(channel, channel.send, [{}]);
}

export function* profileGetLogged () {
    try {
        const loggedProfile = yield select(state => state.profileState.get('loggedProfile'));
        if (loggedProfile.get('account')) {
            return;
        }
        const profile = yield apply(profileService, profileService.profileGetLogged);
        yield put(actions.profileGetLoggedSuccess(profile));
        yield put(actions.profileGetBalance());
        if (profile && profile.profile) {
            yield call(profileGetData, profile.profile, true);
        }
    } catch (error) {
        yield put(actions.profileGetLoggedError(error));
    }
}

function* profileIsFollower ({ followings, akashaId }) {
    const channel = Channel.server.profile.isFollower;
    yield call(enableChannel, channel, Channel.client.profile.manager);
    if (!akashaId) {
        akashaId = yield select(selectLoggedAkashaId);
    }
    const payload = followings.map(following => ({ akashaId, following }));
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

function* profileMoreFollowersIterator ({ akashaId }) {
    const channel = Channel.server.profile.followersIterator;
    const start = yield select(state => selectLastFollower(state, akashaId));
    yield apply(channel, channel.send, [{ akashaId, limit: FOLLOWERS_ITERATOR_LIMIT, start }]);
}

function* profileMoreFollowingsIterator ({ akashaId }) {
    const channel = Channel.server.profile.followingIterator;
    const start = yield select(state => selectLastFollowing(state, akashaId));
    yield apply(channel, channel.send, [{ akashaId, limit: FOLLOWINGS_ITERATOR_LIMIT, start }]);
}

function* profileResolveIpfsHash ({ ipfsHash, columnId, akashaIds }) {
    const channel = Channel.server.profile.resolveProfileIpfsHash;
    // save the akashaIds in the local db for quick suggestions
    yield fork(profileSaveAkashaIds, akashaIds); // eslint-disable-line no-use-before-define
    yield call(enableChannel, channel, Channel.client.profile.manager);
    yield apply(channel, channel.send, [{ ipfsHash, columnId, akashaIds }]);
}

export function* profileSaveAkashaIds (akashaIds) {
    try {
        yield apply(profileService, profileService.profileSaveAkashaIds, [akashaIds]);
    } catch (error) {
        yield put(actions.profileSaveAkashaIdsError(error));
    }
}

function* profileSaveLogged (loggedProfile) {
    try {
        yield apply(profileService, profileService.profileSaveLogged, [loggedProfile]);
    } catch (error) {
        yield put(actions.profileSaveLoggedError(error));
    }
}

function* profileSendTip ({ akashaId, receiver, value, gas }) {
    const channel = Channel.server.profile.tip;
    yield call(enableChannel, channel, Channel.client.profile.manager);
    const token = yield select(selectToken);
    yield apply(channel, channel.send, [{ token, akashaId, receiver, value, gas }]);
}

function* profileUnfollow ({ akashaId, gas, profile }) {
    const channel = Channel.server.profile.unFollowProfile;
    yield call(enableChannel, channel, Channel.client.profile.manager);
    const token = yield select(selectToken);
    yield apply(channel, channel.send, [{ token, akashaId, gas, profile }]);
}

function* profileUpdateLogged (loggedProfile) {
    try {
        yield apply(profileService, profileService.profileUpdateLogged, [loggedProfile]);
    } catch (error) {
        yield put(actions.profileUpdateLoggedError(error));
    }
}

// Action watchers

function* watchProfileDeleteLogged () {
    yield takeLatest(types.PROFILE_DELETE_LOGGED, profileDeleteLogged);
}

function* watchProfileFollow () {
    yield takeEvery(types.PROFILE_FOLLOW, profileFollow);
}

function* watchProfileFollowersIterator () {
    yield takeEvery(types.PROFILE_FOLLOWERS_ITERATOR, profileFollowersIterator);
}

function* watchProfileFollowingsIterator () {
    yield takeEvery(types.PROFILE_FOLLOWINGS_ITERATOR, profileFollowingsIterator);
}

function* watchProfileGetBalance () {
    yield takeLatest(types.PROFILE_GET_BALANCE, profileGetBalance);
}

function* watchProfileGetCurrent () {
    yield takeLatest(types.PROFILE_GET_CURRENT, profileGetCurrent);
}

function* watchProfileGetData () {
    yield takeEvery(types.PROFILE_GET_DATA, profileGetData);
}

function* watchProfileGetList () {
    yield takeLatest(types.PROFILE_GET_LIST, profileGetList);
}

function* watchProfileGetLocal () {
    yield takeLatest(types.PROFILE_GET_LOCAL, profileGetLocal);
}

function* watchProfileGetLogged () {
    yield takeLatest(types.PROFILE_GET_LOGGED, profileGetLogged);
}

function* watchProfileIsFollower () {
    yield takeEvery(types.PROFILE_IS_FOLLOWER, profileIsFollower);
}

function* watchProfileLogin () {
    yield takeLatest(types.PROFILE_LOGIN, profileLogin);
}

function* watchProfileLogout () {
    yield takeLatest(types.PROFILE_LOGOUT, profileLogout);
}

function* watchProfileMoreFollowersIterator () {
    yield takeEvery(types.PROFILE_MORE_FOLLOWERS_ITERATOR, profileMoreFollowersIterator);
}

function* watchProfileMoreFollowingsIterator () {
    yield takeEvery(types.PROFILE_FOLLOWINGS_ITERATOR, profileMoreFollowingsIterator);
}

function* watchProfileResolveIpfsHash () {
    yield takeEvery(types.PROFILE_RESOLVE_IPFS_HASH, profileResolveIpfsHash);
}

function* watchProfileSendTip () {
    yield takeEvery(types.PROFILE_SEND_TIP, profileSendTip);
}

function* watchProfileUnfollow () {
    yield takeEvery(types.PROFILE_UNFOLLOW, profileUnfollow);
}

// Channel watchers

function* watchProfileFollowChannel () {
    while (true) {
        const resp = yield take(actionChannels.profile.followProfile);
        const { akashaId, gas, profile } = resp.request;
        if (resp.error) {
            yield put(actions.profileFollowError(resp.error, resp.request));
        } else {
            const payload = [{
                extra: { akashaId, profile },
                gas,
                tx: resp.data.tx,
                type: actionTypes.follow,
            }];
            yield put(transactionActions.transactionAddToQueue(payload));
            yield put(appActions.showNotification({
                id: 'followingProfile',
                values: { akashaId },
                duration: 3000
            }));
        }
    }
}

function* watchProfileFollowersIteratorChannel () {
    while (true) {
        const resp = yield take(actionChannels.profile.followersIterator);
        if (resp.error) {
            if (resp.request.start) {
                yield put(actions.profileMoreFollowersIteratorError(resp.error, resp.request));
            } else {
                yield put(actions.profileFollowersIteratorError(resp.error, resp.request));
            }
        } else if (resp.request.start) {
            yield put(actions.profileMoreFollowersIteratorSuccess(resp.data));
        } else {
            yield put(actions.profileFollowersIteratorSuccess(resp.data));
        }
    }
}

function* watchProfileFollowingsIteratorChannel () {
    while (true) {
        const resp = yield take(actionChannels.profile.followingIterator);
        if (resp.error) {
            if (resp.request.start) {
                yield put(actions.profileMoreFollowingsIteratorError(resp.error, resp.request));
            } else {
                yield put(actions.profileFollowingsIteratorError(resp.error, resp.request));
            }
        } else if (resp.request.start) {
            yield put(actions.profileMoreFollowingsIteratorSuccess(resp.data));
        } else {
            yield put(actions.profileFollowingsIteratorSuccess(resp.data));
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

function* watchProfileGetCurrentChannel () {
    while (true) {
        const resp = yield take(actionChannels.registry.getCurrentProfile);
        if (resp.error) {
            yield put(actions.profileGetCurrentError(resp.error));
            yield call(profileDeleteLogged);
        } else {
            yield put(actions.profileGetCurrentSuccess(resp.data));
            yield put(actions.profileGetBalance());
            yield call(profileGetData, resp.data.profileAddress, true);
            const loggedProfile = yield select(state =>
                state.profileState.get('loggedProfile').toJS());
            if (loggedProfile.account) {
                yield call(profileSaveLogged, loggedProfile);
            }
        }
    }
}

function* watchProfileGetDataChannel () {
    while (true) {
        const resp = yield take(actionChannels.profile.getProfileData);
        if (resp.error) {
            yield put(actions.profileGetDataError(resp.error));
        } else {
            yield fork(profileSaveAkashaIds, [resp.data.akashaId]); // eslint-disable-line
            yield put(actions.profileGetDataSuccess(resp.data));
        }
    }
}

function* watchProfileGetLocalChannel () {
    while (true) {
        const resp = yield take(actionChannels.auth.getLocalIdentities);
        if (resp.error) {
            yield put(actions.profileGetLocalError(resp.error));
        } else {
            const profileAddresses = resp.data.map(data => ({ profile: data.profile }));
            yield put(actions.profileGetList(profileAddresses));
            yield put(actions.profileGetLocalSuccess(resp.data));
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
        if (!resp.request.reauthenticate) {
            yield put(actions.profileGetCurrent());
        } else {
            yield call(profileUpdateLogged, resp.data);
        }
        yield put(actions.profileLoginSuccess(resp.data));
    }
}

function* watchProfileLogoutChannel () {
    while (true) {
        const resp = yield take(actionChannels.auth.logout);
        if (resp.error) {
            yield put(actions.profileLogoutError(resp.error));
        } else {
            yield call(profileDeleteLogged);
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
        const { akashaId, gas, value } = resp.request;
        if (resp.error) {
            yield put(actions.profileSendTipError(resp.error, resp.request));
        } else {
            const payload = [{
                extra: { akashaId, value },
                gas,
                tx: resp.data.tx,
                type: actionTypes.sendTip
            }];
            yield put(transactionActions.transactionAddToQueue(payload));
            yield put(appActions.showNotification({
                id: 'sendingTip',
                values: { akashaId },
                duration: 3000
            }));
        }
    }
}

function* watchProfileUnfollowChannel () {
    while (true) {
        const resp = yield take(actionChannels.profile.unFollowProfile);
        const { akashaId, gas, profile } = resp.request;
        if (resp.error) {
            yield put(actions.profileUnfollowError(resp.error, resp.request));
        } else {
            const payload = [{
                extra: { akashaId, profile },
                gas,
                tx: resp.data.tx,
                type: actionTypes.unfollow,
            }];
            yield put(transactionActions.transactionAddToQueue(payload));
            yield put(appActions.showNotification({
                id: 'unfollowingProfile',
                values: { akashaId },
                duration: 3000
            }));
        }
    }
}

export function* registerProfileListeners () {
    yield fork(watchProfileFollowChannel);
    yield fork(watchProfileFollowersIteratorChannel);
    yield fork(watchProfileFollowingsIteratorChannel);
    yield fork(watchProfileGetBalanceChannel);
    yield fork(watchProfileGetCurrentChannel);
    yield fork(watchProfileGetDataChannel);
    yield fork(watchProfileGetLocalChannel);
    yield fork(watchProfileGetListChannel);
    yield fork(watchProfileIsFollowerChannel);
    yield fork(watchProfileLogoutChannel);
    yield fork(watchProfileResolveIpfsHashChannel);
    yield fork(watchProfileSendTipChannel);
    yield fork(watchProfileUnfollowChannel);
}

export function* watchProfileActions () {
    yield fork(watchProfileDeleteLogged);
    yield fork(watchProfileFollow);
    yield fork(watchProfileFollowersIterator);
    yield fork(watchProfileFollowingsIterator);
    yield fork(watchProfileGetBalance);
    yield fork(watchProfileGetCurrent);
    yield fork(watchProfileGetData);
    yield fork(watchProfileGetList);
    yield fork(watchProfileGetLocal);
    yield fork(watchProfileGetLogged);
    yield fork(watchProfileIsFollower);
    yield fork(watchProfileLogin);
    yield fork(watchProfileLogout);
    yield fork(watchProfileMoreFollowersIterator);
    yield fork(watchProfileMoreFollowingsIterator);
    yield fork(watchProfileResolveIpfsHash);
    yield fork(watchProfileSendTip);
    yield fork(watchProfileUnfollow);
}

export function* registerWatchers () {
    yield fork(registerProfileListeners);
    yield fork(watchProfileActions);
}
