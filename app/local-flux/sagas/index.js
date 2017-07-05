import { call, fork, put, select, takeEvery } from 'redux-saga/effects';
import * as appActions from '../actions/app-actions';
import * as eProcActions from '../actions/external-process-actions';
import * as transactionActions from '../actions/transaction-actions';
import { searchHandshake } from '../actions/search-actions';
import { selectLoggedAkashaId } from '../selectors';
import { createActionChannels } from './helpers';
import * as commentsSaga from './comments-saga';
import * as dashboardSaga from './dashboard-saga';
import * as entrySaga from './entry-saga';
import * as externalProcSaga from './external-process-saga';
import * as licenseSaga from './license-saga';
import * as listSaga from './list-saga';
import * as profileSaga from './profile-saga';
import * as publisherSaga from './publisher-saga';
import * as searchSaga from './search-saga';
import * as settingsSaga from './settings-saga';
import * as tagSaga from './tag-saga';
import * as tempProfileSaga from './temp-profile-saga';
import * as transactionSaga from './transaction-saga';
import * as utilsSaga from './utils-saga';
import * as types from '../constants';

function* registerListeners () {
    yield fork(commentsSaga.registerCommentsListeners);
    yield fork(licenseSaga.registerLicenseListeners);
    yield fork(entrySaga.registerEntryListeners);
    yield fork(externalProcSaga.registerEProcListeners);
    yield fork(profileSaga.registerProfileListeners);
    yield fork(searchSaga.registerSearchListeners);
    yield fork(tagSaga.registerTagListeners);
    yield fork(transactionSaga.registerTransactionListeners);
    yield fork(utilsSaga.registerUtilsListeners);
}

function* launchActions () {
    const timestamp = new Date().getTime();
    yield put(eProcActions.servicesSetTimestamp(timestamp));
    // from local db
    yield fork(settingsSaga.getSettings);

    // from geth.options channel
    yield fork(externalProcSaga.gethGetOptions);
    // from ipfs.getConfig channel
    yield fork(externalProcSaga.ipfsGetConfig);

    yield fork(externalProcSaga.gethGetStatus);
    yield fork(externalProcSaga.ipfsGetStatus);
}

function* launchHomeActions () {
    yield call(profileSaga.profileGetLogged);
    yield fork(dashboardSaga.dashboardGetActive);
    yield fork(dashboardSaga.dashboardGetAll);
    yield fork(dashboardSaga.dashboardGetColumns);
    yield fork(listSaga.listGetAll);
    yield fork(tagSaga.tagGetMargins);
    if (yield select(selectLoggedAkashaId)) {
        yield put(transactionActions.transactionGetMined());
        yield put(transactionActions.transactionGetPending());
    }
    yield put(searchHandshake());
}

function* bootstrapApp () {
    // the appReady action will be dispatched after these actions will be called
    yield call(launchActions);
    yield put(appActions.appReady());
}

function* bootstrapHome () {
    // launch the necessary actions for the home/dashboard component
    yield call(launchHomeActions);
    yield put(appActions.bootstrapHomeSuccess());
}

function* watchBootstrapHome () {
    yield takeEvery(types.BOOTSTRAP_HOME, bootstrapHome);
}

export default function* rootSaga () {
    createActionChannels();
    yield fork(registerListeners);
    yield fork(commentsSaga.watchCommentsActions);
    yield fork(dashboardSaga.watchDashboardActions);
    yield fork(entrySaga.watchEntryActions);
    yield fork(externalProcSaga.watchEProcActions);
    yield fork(licenseSaga.watchLicenseActions);
    yield fork(listSaga.watchListActions);
    yield fork(profileSaga.watchProfileActions);
    yield fork(publisherSaga.watchPublishActions);
    yield fork(searchSaga.watchSearchActions);
    yield fork(settingsSaga.watchSettingsActions);
    yield fork(tagSaga.watchTagActions);
    yield fork(tempProfileSaga.watchTempProfileActions);
    yield fork(transactionSaga.watchTransactionActions);
    yield fork(utilsSaga.watchUtilsActions);
    yield fork(bootstrapApp);
    yield fork(watchBootstrapHome);
}
