import { call, put, select, takeLatest } from 'redux-saga/effects';
import * as types from '../constants';
import * as tempProfileActions from '../actions/temp-profile-actions';
import * as registryService from '../services/registry-service';

const Channel = global.Channel;

/**
 * Get temp profile from database
 */
function* tempProfileGet ({ ethAddress }) {
    try {
        const data = yield call([registryService, registryService.getTempProfile], ethAddress);
        if (data) {
            yield put(tempProfileActions.tempProfileGetSuccess(data));
        }
    } catch (error) {
        yield put(tempProfileActions.tempProfileGetError(error));
    }
}

/**
 * Create temp profile in database
 */
function* createTempProfile () {
    const tempProfile = yield select(state => state.tempProfileState.get('tempProfile'));
    try {
        const savedProfile = yield call(
            [registryService, registryService.createTempProfile],
            tempProfile.toJS()
        );
        yield put(tempProfileActions.tempProfileCreateSuccess(savedProfile));
    } catch (ex) {
        yield put(tempProfileActions.tempProfileCreateError(ex));
    }
}

/**
 * ... watchers ...
 */

function* tempProfileRemove ({ ethAddress }) {
    try {
        yield call(
            [registryService, registryService.deleteTempProfile],
            ethAddress
        );
        yield put(tempProfileActions.tempProfileDeleteSuccess());
    } catch (err) {
        yield put(tempProfileActions.tempProfileDeleteError(err));
    }
}

export function* watchTempProfileActions () {
    yield takeLatest(types.TEMP_PROFILE_GET, tempProfileGet);
    yield takeLatest(types.TEMP_PROFILE_CREATE, createTempProfile);
    yield takeLatest(types.TEMP_PROFILE_DELETE, tempProfileRemove);
}
