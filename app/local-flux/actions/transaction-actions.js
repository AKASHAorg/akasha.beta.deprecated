import * as types from '../constants';
import { action } from './helpers';

export const transactionAddToQueue = txs => action(types.TRANSACTION_ADD_TO_QUEUE, { txs });

export const transactionAddToQueueError = error => {
    error.code = 'TATQE01';
    error.messageId = 'transactionAddToQueue';
    return action(types.TRANSACTION_ADD_TO_QUEUE_ERROR, { error });
};

export const transactionAddToQueueSuccess = request =>
    action(types.TRANSACTION_ADD_TO_QUEUE_SUCCESS, { request });
export const transactionEmitMinedError = error => {
    error.code = 'TEME01';
    error.messageId = 'transactionEmitMined';
    return action(types.TRANSACTION_EMIT_MINED_ERROR, { error });
};

// export const transactionEmitMinedSuccess = data =>
//     action(types.TRANSACTION_EMIT_MINED_SUCCESS, { data });
export const transactionGetStatus = (txs, ids) => action(types.TRANSACTION_GET_STATUS, {
    txs,
    ids
});

export const transactionGetStatusError = error => {
    error.code = 'TGSE01';
    error.messageId = 'transactionGetStatus';
    return action(types.TRANSACTION_GET_STATUS_ERROR, { error });
};

export const transactionGetStatusSuccess = data => action(types.TRANSACTION_GET_STATUS_SUCCESS, { data });
// export const transactionSavePendingError = (error) => {
//     error.code = 'TSPE01';
//     error.messageId = 'transactionSavePending';
//     return action(types.TRANSACTION_SAVE_PENDING_ERROR, { error });
// };
