import { call, fork, put, take } from 'redux-saga/effects';
import * as types from '../constants/AppConstants';
import { createActionChannels } from './helpers';
import { getGethOptions, getIpfsConfig, registerEProcListeners, toggleGethLogger } from './external-process-saga';
import { getGeneralSettings } from './settings-saga';

function* registerListeners () {
    yield fork(registerEProcListeners);
}

function* bootstrapApp () {
    yield put({ type: 'SET_TIMESTAMP', timestamp: new Date().getTime() });
    yield fork(getGeneralSettings);
    yield fork(getGethOptions);
    yield fork(getIpfsConfig);
}

function* watchBootstrapApp () {
    yield take(types.BOOTSTRAP_APP);
    yield call(bootstrapApp);
}

export default function* rootSaga () {
    createActionChannels();
    yield fork(registerListeners);
    yield fork(watchBootstrapApp);
    // This should be moved away
    yield fork(toggleGethLogger);
}
