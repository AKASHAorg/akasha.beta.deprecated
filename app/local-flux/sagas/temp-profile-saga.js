// @flow
import { call, put, select, takeLatest, getContext } from 'redux-saga/effects';
import * as types from '../constants';
import * as tempProfileActions from '../actions/temp-profile-actions';
import { selectTempProfile } from '../selectors/temp-profile-selectors';
/*::
    import type { Saga } from 'redux-saga';
 */

/*::
    type TempProfileGetParams = {
        ethAddress: string
    }
 */

/**
 * Get temp profile from database
 */
function* tempProfileGet ({ ethAddress } /* : TempProfileGetParams */) /* : Saga<void> */ {
    const registryService = yield getContext('registryService');
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
function* createTempProfile () /* : Saga<void> */ {
    const registryService = yield getContext('registryService');
    const tempProfile = yield select(selectTempProfile);
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
function* deleteTempProfile ({ ethAddress }) /* : Saga<void> */ {
    const registryService = yield getContext('registryService');
    yield call([registryService, registryService.deleteTempProfile], ethAddress);
}

export function* watchTempProfileActions () /* : Saga<void> */ {
    yield takeLatest(types.TEMP_PROFILE_GET, tempProfileGet);
    yield takeLatest(types.TEMP_PROFILE_CREATE, createTempProfile);
    yield takeLatest(types.TEMP_PROFILE_DELETE_FULL, deleteTempProfile);
}
