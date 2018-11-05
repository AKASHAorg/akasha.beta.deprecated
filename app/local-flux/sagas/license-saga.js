// @flow
import { call, takeLatest } from 'redux-saga/effects';
import * as types from '../constants';
import { LICENSE_MODULE } from '@akashaproject/common/constants';
import ChReqService from '../services/channel-request-service';

/*::
    import type { Saga } from 'redux-saga'; // eslint-disable-line
 */

export function* licenseGetAll ()/* : Saga<void> */ {
    yield call(
        [ChReqService, ChReqService.sendRequest],
        LICENSE_MODULE, LICENSE_MODULE.getLicenses, {}
    );
}

export function* watchLicenseActions ()/* : Saga<void> */ {
    yield takeLatest(types.LICENSE_GET_ALL, licenseGetAll);
}
