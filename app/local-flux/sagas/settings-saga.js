import { apply, call, fork, put, take } from 'redux-saga/effects';
import * as settingsService from '../services/settings-service';
import * as actions from '../actions/settings-actions';
import * as types from '../constants/SettingsConstants';

export function* getSettings () {
    yield fork(getGeneralSettings);
    yield fork(getGethSettings);
    yield fork(getIpfsSettings);
}

function* getGeneralSettings () {
    yield put(actions.generalSettingsRequest());
    try {
        const resp = yield apply(settingsService, settingsService.getGeneralSettings);
        yield put(actions.generalSettingsSuccess(resp));
    } catch (error) {
        yield put(actions.generalSettingsError({ message: error.toString() }));
    }
}

function* getGethSettings () {
    yield put(actions.gethSettingsRequest());
    try {
        const resp = yield apply(settingsService, settingsService.getGethSettings);
        yield put(actions.gethSettingsSuccess(resp));
    } catch (error) {
        yield put(actions.gethSettingsError({ message: error.toString() }));
    }
}

function* getIpfsSettings () {
    yield put(actions.ipfsSettingsRequest());
    try {
        const resp = yield apply(settingsService, settingsService.getIpfsSettings);
        yield put(actions.ipfsSettingsSuccess(resp));
    } catch (error) {
        yield put(actions.ipfsSettingsError({ message: error.toString() }));
    }
}

export function* saveGeneralSettings (payload) {
    try {
        const resp = yield apply(settingsService, settingsService.saveGeneralSettings, [payload]);
        yield put(actions.saveGeneralSettingsSuccess(resp));
    } catch (error) {
        yield put(actions.saveGeneralSettingsError({ message: error.toString() }));
    }
}

export function* saveGethSettings (payload) {
    try {
        const resp = yield apply(settingsService, settingsService.saveGethSettings, [payload]);
        yield put(actions.saveGethSettingsSuccess(resp));
    } catch (error) {
        yield put(actions.saveGethSettingsError({ message: error.toString() }));
    }
}

export function* saveIpfsSettings (payload) {
    try {
        const resp = yield apply(settingsService, settingsService.saveIpfsSettings, [payload]);
        yield put(actions.saveIpfsSettingsSuccess(resp));
    } catch (error) {
        yield put(actions.saveIpfsSettingsError({ message: error.toString() }));
    }
}

function* saveConfiguration (action) {
    try {
        yield [
            call(saveGethSettings, action.payload.geth),
            call(saveIpfsSettings, action.payload.ipfs)
        ];
        yield call(saveGeneralSettings, { configurationSaved: true });
    } catch (error) {
        console.error('saga - save configuration error');
    }
}

function* watchGeneralSettingsSave () {
    while (true) {
        const action = yield take(types.GENERAL_SETTINGS_SAVE_REQUEST);
        yield fork(saveGeneralSettings, action.payload);
    }
}

function* watchGethSettingsSave () {
    while (true) {
        const action = yield take(types.GETH_SETTINGS_SAVE_REQUEST);
        yield fork(saveGethSettings, action.payload);
    }
}

function* watchIpfsSettingsSave () {
    while (true) {
        const action = yield take(types.IPFS_SETTINGS_SAVE_REQUEST);
        yield fork(saveIpfsSettings, action.payload);
    }
}

function* watchSaveConfiguration () {
    while (true) {
        const action = yield take(types.SAVE_CONFIGURATION);
        yield fork(saveConfiguration, action);
    }
}

export function* watchSettingsActions () {
    yield fork(watchSaveConfiguration);
    yield fork(watchGeneralSettingsSave);
    yield fork(watchGethSettingsSave);
    yield fork(watchIpfsSettingsSave);
}
