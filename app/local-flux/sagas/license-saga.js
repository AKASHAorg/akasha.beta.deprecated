// @flow
import { call, takeLatest } from 'redux-saga/effects';
import { LICENCE_MODULE } from '@akashaproject/common/constants';
import ChReqService from '../services/channel-request-service';

/*::
    import type { Saga } from 'redux-saga'; // eslint-disable-line
 */

export function* licenseGetAll ()/* : Saga<void> */ {
    yield call(
        [ChReqService, ChReqService.sendRequest],
        LICENCE_MODULE, LICENCE_MODULE.getLicences, {}
    );
}

export function* watchLicenseActions ()/* : Saga<void> */ {
    yield takeLatest(LICENCE_MODULE.getLicences, licenseGetAll);
}
