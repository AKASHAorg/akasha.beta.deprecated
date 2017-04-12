import { call, fork, put } from 'redux-saga/effects';
import * as actions from '../actions/app-actions';
import { createActionChannels } from './helpers';
import * as licenseSaga from './license-saga';
import * as entrySaga from './entry-saga';
import * as externalProcSaga from './external-process-saga';
import * as profileSaga from './profile-saga';
import * as settingsSaga from './settings-saga';
import * as tempProfileSaga from './temp-profile-saga';
import * as utilsSaga from './utils-saga';

function* registerListeners () {
    yield fork(licenseSaga.registerLicenseListeners);
    yield fork(entrySaga.registerEntryListeners);
    yield fork(externalProcSaga.registerEProcListeners);
    yield fork(profileSaga.registerProfileListeners);
    yield fork(utilsSaga.registerUtilsListeners);
}

function* launchActions () {
    const timestamp = new Date().getTime();
    yield put(actions.setTimestamp(timestamp));
    // from local db
    yield fork(settingsSaga.getSettings);

    // from geth.options channel
    yield fork(externalProcSaga.gethGetOptions);
    // from ipfs.getConfig channel
    yield fork(externalProcSaga.ipfsGetConfig);

    yield fork(externalProcSaga.gethGetStatus);
    yield fork(externalProcSaga.ipfsGetStatus);
}

function* bootstrapApp () {
    // the appReady action will be dispatched after these actions will be called
    yield call(launchActions);
    yield put(actions.appReady());
}

export default function* rootSaga () {
    createActionChannels();
    yield fork(registerListeners);
    yield fork(bootstrapApp);
    yield fork(entrySaga.watchEntryActions);
    yield fork(externalProcSaga.watchEProcActions);
    yield fork(licenseSaga.watchLicenseActions);
    yield fork(profileSaga.watchProfileActions);
    yield fork(settingsSaga.watchSettingsActions);
    yield fork(tempProfileSaga.watchTempProfileActions);
    yield fork(utilsSaga.watchUtilsActions);
}
