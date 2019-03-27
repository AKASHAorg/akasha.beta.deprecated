// @flow
import { call, takeEvery, getContext } from 'redux-saga/effects';
import { TX_MODULE } from '@akashaproject/common/constants';
import * as types from '../constants';

/*::
    import type { Saga } from 'redux-saga';
 */

/*::
    type TxGetStatus = {
        txs: string,
        ids: Array<string>
    }
 */

export function* transactionGetStatus ({ txs, ids } /* : TxGetStatus */) /* :Saga<void> */ {
    const service = yield getContext('reqService');
    yield call([service, service.sendRequest], TX_MODULE, TX_MODULE.getTransaction, {
        transactionHash: txs,
        actionIds: ids
    });
}

export function* watchTransactionActions () /* : Saga<void> */ {
    yield takeEvery(types.TRANSACTION_GET_STATUS, transactionGetStatus);
}
