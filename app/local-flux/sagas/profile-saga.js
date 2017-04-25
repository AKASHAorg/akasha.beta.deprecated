import { apply, call, fork, put, select, take, takeEvery, takeLatest } from 'redux-saga/effects';
import { actionChannels, enableChannel } from './helpers';
import * as actions from '../actions/profile-actions';
import * as types from '../constants';
import * as profileService from '../services/profile-service';

const Channel = global.Channel;

function* profileDeleteLogged () {
    try {
        yield apply(profileService, profileService.profileDeleteLogged);
        yield put(actions.profileDeleteLoggedSuccess());
    } catch (error) {
        yield put(actions.profileDeleteLoggedError());
    }
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
            console.log('No need to get logged profile from db');
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

function* profileSaveLogged (loggedProfile) {
    try {
        yield apply(profileService, profileService.profileSaveLogged, [loggedProfile]);
    } catch (error) {
        yield put(actions.profileSaveLoggedError(error));
    }
}

// Action watchers

function* watchProfileDeleteLogged () {
    yield takeLatest(types.PROFILE_DELETE_LOGGED, profileDeleteLogged);
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

function* watchProfileLogin () {
    yield takeLatest(types.PROFILE_LOGIN, profileLogin);
}

function* watchProfileLogout () {
    yield takeLatest(types.PROFILE_LOGOUT, profileLogout);
}

// Channel watchers

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

function* watchProfileLoginChannel () {
    const resp = yield take(actionChannels.auth.login);
    if (resp.error) {
        yield put(actions.profileLoginError(resp.error));
    } else {
        yield put(actions.profileGetCurrent());
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
            yield put(actions.profileLogoutSuccess());
        }
    }
}

export function* registerProfileListeners () {
    yield fork(watchProfileGetBalanceChannel);
    yield fork(watchProfileGetCurrentChannel);
    yield fork(watchProfileGetDataChannel);
    yield fork(watchProfileGetLocalChannel);
    yield fork(watchProfileGetListChannel);
    yield fork(watchProfileLogoutChannel);
}

export function* watchProfileActions () {
    yield fork(watchProfileDeleteLogged);
    yield fork(watchProfileGetBalance);
    yield fork(watchProfileGetCurrent);
    yield fork(watchProfileGetData);
    yield fork(watchProfileGetList);
    yield fork(watchProfileGetLocal);
    yield fork(watchProfileGetLogged);
    yield fork(watchProfileLogin);
    yield fork(watchProfileLogout);
}

export function* registerWatchers () {
    yield fork(registerProfileListeners);
    yield fork(watchProfileActions);
}
