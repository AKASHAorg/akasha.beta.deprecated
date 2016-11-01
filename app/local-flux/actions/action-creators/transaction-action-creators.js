import * as types from '../../constants/TransactionConstants';

export function transactionMinedSuccess (data) {
    return {
        type: types.TRANSACTION_MINED_SUCCESS,
        data
    };
}

export function transactionMinedError (error) {
    return {
        type: types.TRANSACTION_MINED_ERROR,
        error
    };
}

export function addToQueueSuccess (data) {
    return {
        type: types.ADD_TO_QUEUE_SUCCESS,
        data
    };
}

export function addToQueueError (error) {
    return {
        type: types.ADD_TO_QUEUE_ERROR,
        error
    };
}

export function getMinedTransactions () {
    return {
        type: types.GET_MINED_TRANSACTION
    };
}

export function getMinedTransactionsError (error) {
    return {
        type: types.GET_MINED_TRANSACTION_ERROR,
        error
    };
}

export function getMinedTransactionsSuccess (data) {
    return {
        type: types.GET_MINED_TRANSACTION_SUCCESS,
        data
    };
}

export function getPendingTransactions () {
    return {
        type: types.GET_PENDING_TRANSACTION
    };
}

export function getPendingTransactionsError (error) {
    return {
        type: types.GET_PENDING_TRANSACTION_ERROR,
        error
    };
}

export function getPendingTransactionsSuccess (data) {
    return {
        type: types.GET_PENDING_TRANSACTION_SUCCESS,
        data
    };
}
