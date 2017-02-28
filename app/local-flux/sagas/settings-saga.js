import { apply, call, fork, put, take } from 'redux-saga/effects';
import * as settingsService from '../services/settings-service';
import * as actions from '../actions/settings-actions';
import * as types from '../constants/SettingsConstants';

export function* getGeneralSettings () {
    yield put(actions.generalSettingsRequest());
    try {
        const resp = yield apply(settingsService, settingsService.getGeneralSettings);
        yield put(actions.generalSettingsSuccess(resp));
    } catch (error) {
        yield put(actions.generalSettingsError({ message: error.toString() }));
    }
}

export function* saveGeneralSettings (payload) {
    try {
        const resp = yield apply(settingsService, settingsService.saveGeneralSettings, [payload]);
        console.log('save general settings success');
        yield put(actions.saveGeneralSettingsSuccess(resp));
    } catch (error) {
        console.error('saga - save general settings error');
        yield put(actions.saveGeneralSettingsError({ message: error.toString() }));
    }
}

export function* saveGethSettings (payload) {
    try {
        console.log('save geth settings');
        const resp = yield apply(settingsService, settingsService.saveGethSettings, [payload]);
        console.log('save geth settings success');
        yield put(actions.saveGethSettingsSuccess(resp));
    } catch (error) {
        console.error('saga - save geth settings error');
        yield put(actions.saveGethSettingsError({ message: error.toString() }));
    }
}

export function* saveIpfsSettings (payload) {
    try {
        console.log('save ipfs settings');
        const resp = yield apply(settingsService, settingsService.saveIpfsSettings, [payload]);
        console.log('save ipfs settings success');
        yield put(actions.saveIpfsSettingsSuccess(resp));
    } catch (error) {
        console.error('saga - save ipfs settings error');
        yield put(actions.saveIpfsSettingsError({ message: error.toString() }));
    }
}

function* saveConfiguration (action) {
    try {
        console.log('save configuration');
        yield [
            call(saveGethSettings, action.payload.geth),
            call(saveIpfsSettings, action.payload.ipfs)
        ];
        console.log('save general settings');
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
