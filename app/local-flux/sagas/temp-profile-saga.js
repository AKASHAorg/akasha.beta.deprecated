import { call, put, select, takeLatest } from 'redux-saga/effects';
import * as types from '../constants';
import * as tempProfileActions from '../actions/temp-profile-actions';
import * as registryService from '../services/registry-service';


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
 * Delete temp profile in database
 */
function* deleteTempProfile ({ ethAddress }) {
    yield call([registryService, registryService.deleteTempProfile], ethAddress);
}


export function* watchTempProfileActions () {
    yield takeLatest(types.TEMP_PROFILE_GET, tempProfileGet);
    yield takeLatest(types.TEMP_PROFILE_CREATE, createTempProfile);
    yield takeLatest(types.TEMP_PROFILE_DELETE_FULL, deleteTempProfile);
}
