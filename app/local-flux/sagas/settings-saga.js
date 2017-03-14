import { apply, call, fork, put, take } from 'redux-saga/effects';
import * as settingsService from '../services/settings-service';
import * as actions from '../actions/settings-actions';
import * as appActions from '../actions/app-actions';
import * as types from '../constants';

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

export function* getSettings () {
    yield fork(getGeneralSettings);
    yield fork(getGethSettings);
    yield fork(getIpfsSettings);
}

export function* saveGeneralSettings (payload) {
    try {
        const resp = yield apply(settingsService, settingsService.saveGeneralSettings, [payload]);
        yield put(actions.saveGeneralSettingsSuccess(resp));
    } catch (error) {
        yield put(actions.saveGeneralSettingsError({ message: error.toString() }));
    }
}

export function* gethSaveSettings (payload, showNotification) {
    try {
        const resp = yield apply(settingsService, settingsService.gethSaveSettings, [payload]);
        yield put(actions.gethSaveSettingsSuccess(resp));
        if (showNotification) {
            yield put(appActions.showNotification({
                id: 'saveGethSettingsSuccess'
            }));
        }
    } catch (error) {
        yield put(actions.gethSaveSettingsError({ message: error.toString() }));
    }
}

export function* ipfsSaveSettings (payload, showNotification) {
    try {
        if (payload.ports) {
            delete payload.ports;
        }
        const resp = yield apply(settingsService, settingsService.saveIpfsSettings, [payload]);
        yield put(actions.ipfsSaveSettingsSuccess(resp));
        if (showNotification) {
            yield put(appActions.showNotification({
                id: 'saveIpfsSettingsSuccess'
            }));
        }
    } catch (error) {
        yield put(actions.ipfsSaveSettingsError({ message: error.toString() }));
    }
}

function* saveConfiguration (action) {
    try {
        yield [
            call(gethSaveSettings, action.payload.geth),
            call(ipfsSaveSettings, action.payload.ipfs)
        ];
        yield call(saveGeneralSettings, { configurationSaved: true });
    } catch (error) {
        console.error('saga - save configuration error');
    }
}

// WATCHERS

function* watchGeneralSettingsSave () {
    while (true) {
        const action = yield take(types.GENERAL_SETTINGS_SAVE);
        yield fork(saveGeneralSettings, action.payload);
    }
}

function* watchGethSaveSettings () {
    while (true) {
        const action = yield take(types.GETH_SAVE_SETTINGS);
        yield fork(gethSaveSettings, action.payload, action.showNotification);
    }
}

function* watchIpfsSettingsSave () {
    while (true) {
        const action = yield take(types.IPFS_SAVE_SETTINGS);
        yield fork(ipfsSaveSettings, action.payload, action.showNotification);
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
    yield fork(watchGethSaveSettings);
    yield fork(watchIpfsSettingsSave);
}
