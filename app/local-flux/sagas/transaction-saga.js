// @flow
import { call, takeEvery } from 'redux-saga/effects';
import { TX_MODULE } from '@akashaproject/common/constants';
import * as types from '../constants';
import ChReqService from '../services/channel-request-service';

import type { Saga } from 'redux-saga';

/*::
    type TxGetStatus = {
        txs: string,
        ids: Array<string>
    }
 */

export function* transactionGetStatus ({ txs, ids }/* : TxGetStatus */)/* :Saga<void> */ {
    yield call(
        [ChReqService, ChReqService.sendRequest],
        TX_MODULE, TX_MODULE.getTransaction, {
            transactionHash: txs,
            actionIds: ids
        }
    )
}

export function* watchTransactionActions ()/* : Saga<void> */ {
    yield takeEvery(types.TRANSACTION_GET_STATUS, transactionGetStatus);
}
