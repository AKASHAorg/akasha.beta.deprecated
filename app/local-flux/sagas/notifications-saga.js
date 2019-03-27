// @flow
import { call, select, takeEvery, getContext } from 'redux-saga/effects';
import { profileSelectors, settingsSelectors, externalProcessSelectors } from '../selectors';
import { NOTIFICATIONS_MODULE } from '@akashaproject/common/constants';

/*::
    import type { Saga } from 'redux-saga';
 */

// Estimated number of blocks mined in one week
const ONE_WEEK = (7 * 24 * 3600) / 15;

function* notificationsSubscribe ({ notificationsPreferences }) /* : Saga<void> */ {
    const service = yield getContext('reqService');
    const profileService = yield getContext('profileService');
    const ethAddress = yield select(profileSelectors.selectLoggedEthAddress);
    const settings =
        notificationsPreferences || (yield select(settingsSelectors.getNotificationsPreference)).toJS();
    const lastBlock = yield call([profileService, profileService.profileGetLastBlockNr], ethAddress);
    const currentBlock = yield select(externalProcessSelectors.getCurrentBlockNumber);
    const fromBlock = Math.max(lastBlock, currentBlock - ONE_WEEK);
    const payload = { settings, profile: { ethAddress }, fromBlock };
    yield call([service, service.sendRequest], NOTIFICATIONS_MODULE, NOTIFICATIONS_MODULE.subscribe, payload);
}

export function* watchNotificationsActions () /* : Saga<void> */ {
    yield takeEvery(NOTIFICATIONS_MODULE.subscribe, notificationsSubscribe);
}
