import { all, apply, call, fork, put, select, take } from 'redux-saga/effects';
import * as actions from '../actions/settings-actions';
import * as appActions from '../actions/app-actions';
import * as types from '../constants';
import { selectLoggedEthAddress } from '../selectors';
import * as settingsService from '../services/settings-service';

export function* generalSettingsRequest () {
    yield put(actions.generalSettingsRequest());
    try {
        const resp = yield apply(settingsService, settingsService.generalSettingsRequest);
        localStorage.setItem('theme', resp.darkTheme ? '1' : '0');
        yield put(actions.generalSettingsSuccess(resp));
    } catch (error) {
        yield put(actions.generalSettingsError({ message: error.toString() }));
    }
}

export function* gethSettingsRequest () {
    yield put(actions.gethSettingsRequest());
    try {
        const resp = yield apply(settingsService, settingsService.gethSettingsRequest);
        yield put(actions.gethSettingsSuccess(resp));
    } catch (error) {
        yield put(actions.gethSettingsError({ message: error.toString() }));
    }
}

export function* ipfsSettingsRequest () {
    yield put(actions.ipfsSettingsRequest());
    try {
        const resp = yield apply(settingsService, settingsService.ipfsSettingsRequest);
        yield put(actions.ipfsSettingsSuccess(resp));
    } catch (error) {
        yield put(actions.ipfsSettingsError({ message: error.toString() }));
    }
}

export function* getSettings () {
    yield fork(generalSettingsRequest);
    yield fork(gethSettingsRequest);
    yield fork(ipfsSettingsRequest);
}

export function* saveGeneralSettings ({ type, ...payload }) {
    try {
        const resp = yield apply(settingsService, settingsService.generalSettingsSave, [payload]);
        yield put(actions.saveGeneralSettingsSuccess(resp));
        localStorage.setItem('theme', payload.darkTheme ? '1' : '0');
    } catch (error) {
        yield put(actions.saveGeneralSettingsError({ message: error.toString() }));
    }
}

export function* gethSaveSettings (payload, showNotification) {
    try {
        const resp = yield apply(settingsService, settingsService.gethSettingsSave, [payload]);
        yield put(actions.gethSaveSettingsSuccess(resp));
        if (showNotification) {
            yield put(appActions.showNotification({
                id: 'saveGethSettingsSuccess',
                duration: 4,
            }));
        }
    } catch (error) {
        yield put(actions.gethSaveSettingsError({ message: error.toString() }));
    }
}

export function* ipfsSaveSettings (payload, showNotification) {
    try {
        const { ports, ...rest } = payload;
        const resp = yield apply(settingsService, settingsService.ipfsSettingsSave, [rest]);
        yield put(actions.ipfsSaveSettingsSuccess(resp));
        if (showNotification) {
            yield put(appActions.showNotification({
                id: 'saveIpfsSettingsSuccess',
                duration: 4,
            }));
        }
    } catch (error) {
        yield put(actions.ipfsSaveSettingsError({ message: error.toString() }));
    }
}

function* saveConfiguration (action) {
    yield all([
        call(gethSaveSettings, action.payload.geth),
        call(ipfsSaveSettings, action.payload.ipfs)
    ]);
    yield call(saveGeneralSettings, { configurationSaved: true });
}

export function* userSettingsRequest (ethAddress) {
    try {
        if (!ethAddress) {
            ethAddress = yield select(selectLoggedEthAddress);
        }
        const resp = yield apply(settingsService, settingsService.userSettingsRequest, [ethAddress]);
        yield put(actions.userSettingsSuccess(resp));
    } catch (error) {
        yield put(actions.userSettingsError({ message: error.toString() }));
    }
}

function* userSettingsSave (ethAddress, payload) {
    try {
        const resp = yield apply(
            settingsService, settingsService.userSettingsSave, [ethAddress, payload]
        );
        yield put(actions.userSettingsSaveSuccess(resp));
        // yield put(appActions.showNotification({ id: 'userSettingsSaveSuccess' }));
    } catch (error) {
        yield put(actions.userSettingsSaveError(error));
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

function* watchUserSettingsRequest () {
    while (true) {
        const action = yield take(types.USER_SETTINGS_REQUEST);
        yield fork(userSettingsRequest, action.ethAddress);
    }
}

function* watchUserSettingsSave () {
    while (true) {
        const action = yield take(types.USER_SETTINGS_SAVE);
        yield fork(userSettingsSave, action.ethAddress, action.payload);
    }
}

export function* watchSettingsActions () {
    yield fork(watchSaveConfiguration);
    yield fork(watchGeneralSettingsSave);
    yield fork(watchGethSaveSettings);
    yield fork(watchIpfsSettingsSave);
    yield fork(watchUserSettingsRequest);
    yield fork(watchUserSettingsSave);
}
