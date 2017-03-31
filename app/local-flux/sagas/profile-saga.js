import { apply, call, fork, put, select, take, takeLatest } from 'redux-saga/effects';
import { actionChannels, enableChannel } from './helpers';
import * as actions from '../actions/profile-actions';
import * as types from '../constants';
import * as profileService from '../services/profile-service';

const Channel = global.Channel;

function* profileGetCurrent () {
    const channel = Channel.server.registry.getCurrentProfile;
    yield apply(channel, channel.send, [{}]);
}

function* profileGetLocal () {
    const channel = Channel.server.auth.getLocalIdentities;
    yield call(enableChannel, channel, Channel.client.auth.manager);
    yield apply(channel, channel.send, [{}]);
}

function* profileGetList ({ profileAddresses }) {
    const channel = Channel.server.profile.getProfileList;
    yield call(enableChannel, channel, Channel.client.profile.manager);
    yield apply(channel, channel.send, [profileAddresses]);
}

function* profileLogin ({ data }) {
    const channel = Channel.server.auth.login;
    data.password = new TextEncoder('utf-8').encode(data.password);
    yield apply(channel, channel.send, [data]);
}

function* profileSaveLogged (loggedProfile) {
    try {
        yield apply(profileService, profileService.profileSaveLogged, [loggedProfile]);
    } catch (error) {
        yield put(actions.profileSaveLoggedError(error));
    }
}

// Action watchers

function* watchProfileGetCurrent () {
    yield takeLatest(types.PROFILE_GET_CURRENT, profileGetCurrent);
}

function* watchProfileGetLocal () {
    yield takeLatest(types.PROFILE_GET_LOCAL, profileGetLocal);
}

function* watchProfileGetList () {
    yield takeLatest(types.PROFILE_GET_LIST, profileGetList);
}

function* watchProfileLogin () {
    yield takeLatest(types.PROFILE_LOGIN, profileLogin);
}

// Channel watchers

function* watchProfileGetCurrentChannel () {
    while (true) {
        const resp = yield take(actionChannels.registry.getCurrentProfile);
        if (resp.error) {
            yield put(actions.profileGetCurrentError(resp.error));
        } else {
            yield put(actions.profileGetCurrentSuccess(resp.data));
            const loggedProfile = yield select(state =>
                state.profileState.get('loggedProfile').toJS());
            yield fork(profileSaveLogged, loggedProfile);
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
    while (true) {
        const resp = yield take(actionChannels.auth.login);
        if (resp.error) {
            yield put(actions.profileLoginError(resp.error));
        } else {
            yield put(actions.profileGetCurrent());
            yield put(actions.profileLoginSuccess(resp.data));
        }
    }
}

export function* registerProfileListeners () {
    yield fork(watchProfileGetCurrentChannel);
    yield fork(watchProfileGetLocalChannel);
    yield fork(watchProfileGetListChannel);
    yield fork(watchProfileLoginChannel);
}

export function* watchProfileActions () {
    yield fork(watchProfileGetCurrent);
    yield fork(watchProfileGetLocal);
    yield fork(watchProfileGetList);
    yield fork(watchProfileLogin);
}

export function* registerWatchers () {
    yield fork(registerProfileListeners);
    yield fork(watchProfileActions);
}
