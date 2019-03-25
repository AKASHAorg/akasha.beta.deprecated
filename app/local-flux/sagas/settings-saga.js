//@flow
import { all, call, fork, put, select, takeEvery } from 'redux-saga/effects';
import * as actions from '../actions/settings-actions';
import * as appActions from '../actions/app-actions';
import * as types from '../constants';
import { profileSelectors } from '../selectors';
import * as settingsService from '../services/settings-service';

/*::
    import type { Saga } from 'redux-saga';
 */

export function* generalSettingsRequest () /* :Saga<void> */ {
    yield put(actions.generalSettingsRequest());
    try {
        const resp = yield call([settingsService, settingsService.generalSettingsRequest]);
        localStorage.setItem('theme', resp.darkTheme ? '1' : '0');
        yield put(actions.generalSettingsSuccess(resp));
    } catch (error) {
        yield put(actions.generalSettingsError({ message: error.toString() }));
    }
}

export function* gethSettingsRequest () /* :Saga<void> */ {
    yield put(actions.gethSettingsRequest());
    try {
        const resp = yield call([settingsService, settingsService.gethSettingsRequest]);
        yield put(actions.gethSettingsSuccess(resp));
    } catch (error) {
        yield put(actions.gethSettingsError({ message: error.toString() }));
    }
}

export function* ipfsSettingsRequest () /* :Saga<void> */ {
    yield put(actions.ipfsSettingsRequest());
    try {
        const resp = yield call([settingsService, settingsService.ipfsSettingsRequest]);
        yield put(actions.ipfsSettingsSuccess(resp));
    } catch (error) {
        yield put(actions.ipfsSettingsError({ message: error.toString() }));
    }
}

export function* getSettings () /* :Saga<void> */ {
    yield fork(generalSettingsRequest);
    yield fork(gethSettingsRequest);
    yield fork(ipfsSettingsRequest);
}

export function* saveGeneralSettings ({ type, ...payload } /* :Object */) /* :Saga<void> */ {
    try {
        const resp = yield call([settingsService, settingsService.generalSettingsSave], payload);
        yield put(actions.saveGeneralSettingsSuccess(resp));
        localStorage.setItem('theme', payload.darkTheme ? '1' : '0');
    } catch (error) {
        yield put(actions.saveGeneralSettingsError({ message: error.toString() }));
    }
}

export function* gethSaveSettings ({ payload, showNotification } /*: Object*/) /* :Saga<void> */ {
    try {
        const resp = yield call([settingsService, settingsService.gethSettingsSave], payload);
        yield put(actions.gethSaveSettingsSuccess(resp));
        if (showNotification) {
            yield put(
                appActions.showNotification({
                    id: 'saveGethSettingsSuccess',
                    duration: 4
                })
            );
        }
    } catch (error) {
        yield put(actions.gethSaveSettingsError({ message: error.toString() }));
    }
}

export function* ipfsSaveSettings ({ payload, showNotification } /*: Object*/) /* :Saga<void> */ {
    try {
        const { ports, ...rest } = payload;
        const resp = yield call([settingsService, settingsService.ipfsSettingsSave], rest);
        yield put(actions.ipfsSaveSettingsSuccess(resp));
        if (showNotification) {
            yield put(
                appActions.showNotification({
                    id: 'saveIpfsSettingsSuccess',
                    duration: 4
                })
            );
        }
    } catch (error) {
        yield put(actions.ipfsSaveSettingsError({ message: error.toString() }));
    }
}

function* saveConfiguration ({ payload }) /* :Saga<void> */ {
    yield all([call(gethSaveSettings, payload.geth), call(ipfsSaveSettings, payload.ipfs)]);
    yield call(saveGeneralSettings, { configurationSaved: true });
}

export function* userSettingsRequest ({ ethAddress } /*: Object*/) /* :Saga<void> */ {
    try {
        if (!ethAddress) {
            ethAddress = yield select(profileSelectors.selectLoggedEthAddress);
        }
        const resp = yield call([settingsService, settingsService.userSettingsRequest], ethAddress);
        yield put(actions.userSettingsSuccess(resp));
    } catch (error) {
        yield put(actions.userSettingsError({ message: error.toString() }));
    }
}

function* userSettingsSave ({ ethAddress, payload }) /* :Saga<void> */ {
    try {
        const resp = yield call([settingsService, settingsService.userSettingsSave], ethAddress, payload);
        yield put(actions.userSettingsSaveSuccess(resp));
    } catch (error) {
        yield put(actions.userSettingsSaveError(error));
    }
}

function* userSettingsAddTrustedDomain ({ ethAddress, domain }) /* :Saga<void> */ {
    try {
        const resp = yield call(
            [settingsService, settingsService.userSettingsAddTrustedDomain],
            ethAddress,
            domain
        );
        yield put(actions.userSettingsAddTrustedDomainSuccess(resp));
    } catch (error) {
        yield put(actions.userSettingsAddTrustedDomainError(error));
    }
}

export function* watchSettingsActions () /* : Saga<void> */ {
    yield takeEvery(types.USER_SETTINGS_SAVE, userSettingsSave);
    yield takeEvery(types.USER_SETTINGS_REQUEST, userSettingsRequest);
    yield takeEvery(types.SAVE_CONFIGURATION, saveConfiguration);
    yield takeEvery(types.IPFS_SAVE_SETTINGS, ipfsSaveSettings);
    yield takeEvery(types.GETH_SAVE_SETTINGS, gethSaveSettings);
    yield takeEvery(types.GENERAL_SETTINGS_SAVE, saveGeneralSettings);
    yield takeEvery(types.USER_SETTINGS_ADD_TRUSTED_DOMAIN, userSettingsAddTrustedDomain);
}
