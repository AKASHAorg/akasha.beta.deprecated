// @flow
// import { call, takeEvery } from 'redux-saga/effects';
// import { UTILS_MODULE } from '@akashaproject/common/constants';
// import * as types from '../constants';
// import ChReqService from '../services/channel-request-service';

/*::
    import type { Saga } from 'redux-saga';
 */

// function* backupKeysRequest ()/* : Saga<void> */ {
//     yield call(
//         [ChReqService, ChReqService.sendRequest],
//         UTILS_MODULE, UTILS_MODULE.backupKeys,
//         {}
//     );
// }

// function* reloadPage ()/* : Saga<void> */ {
//     yield call(
//         [ChReqService, ChReqService.sendRequest],
//         UTILS_MODULE, UTILS_MODULE.reloadPage,
//         {}
//     );
// }

export function* watchUtilsActions ()/* : Saga<void>  */{
    // yield takeEvery(types.BACKUP_KEYS_REQUEST, backupKeysRequest);
    // yield takeEvery(types.RELOAD_PAGE, reloadPage);
}
