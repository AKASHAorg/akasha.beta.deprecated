// @flow
import { call, getContext, takeLatest } from 'redux-saga/effects';
import { LICENCE_MODULE } from '@akashaproject/common/constants';

/*::
    import type { Saga } from 'redux-saga'; // eslint-disable-line
 */

export function* licenseGetAll () /* : Saga<void> */ {
    const service = yield getContext('reqService');
    yield call([service, service.sendRequest], LICENCE_MODULE, LICENCE_MODULE.getLicences, {});
}

export function* watchLicenseActions () /* : Saga<void> */ {
    yield takeLatest(LICENCE_MODULE.getLicences, licenseGetAll);
}
