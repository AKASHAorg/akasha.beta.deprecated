import { apply, call, fork, put, select, take, takeEvery } from 'redux-saga/effects';
import { actionChannels, enableChannel } from './helpers';
import * as profileActions from '../actions/profile-actions';
import * as actions from '../actions/transaction-actions';
import * as types from '../constants';
import { selectLoggedAkashaId, selectPendingTx } from '../selectors';
import * as transactionService from '../services/transaction-service';

const Channel = global.Channel;

function* transactionAddToQueue ({ txs }) {
    const channel = Channel.server.tx.addToQueue;
    yield call(enableChannel, channel, Channel.client.tx.manager);
    const akashaId = yield select(selectLoggedAkashaId);
    txs.forEach(tx => (tx.akashaId = akashaId));
    yield apply(channel, channel.send, [txs]);
}

function* transactionDeletePending ({ tx }) {
    try {
        yield apply(transactionService, transactionService.transactionDeletePending, [tx]);
        yield put(actions.transactionDeletePendingSuccess(tx));
    } catch (err) {
        yield put(actions.transactionDeletePendingError(err, tx));
    }
}

export function* transactionGetMined () {
    try {
        const akashaId = yield select(selectLoggedAkashaId);
        const mined = yield apply(
            transactionService,
            transactionService.transactionGetMined,
            [akashaId]
        );
        yield put(actions.transactionGetMinedSuccess(mined));
    } catch (err) {
        yield put(actions.transactionGetMinedError(err));
    }
}

export function* transactionGetPending () {
    try {
        const akashaId = yield select(selectLoggedAkashaId);
        const mined = yield apply(
            transactionService,
            transactionService.transactionGetPending,
            [akashaId]
        );
        yield put(actions.transactionGetPendingSuccess(mined));
    } catch (err) {
        yield put(actions.transactionGetPendingError(err));
    }
}

function* transactionSaveMined (minedTx) {
    try {
        yield apply(transactionService, transactionService.transactionSaveMined, [minedTx]);
        yield put(actions.transactionEmitMinedSuccess(minedTx));
    } catch (err) {
        yield put(actions.transactionSaveMinedError(err));
    }
}

function* transactionSavePending (txs) {
    try {
        yield apply(transactionService, transactionService.transactionSavePending, [txs]);
        yield put(actions.transactionAddToQueueSuccess(txs));
    } catch (err) {
        yield put(actions.transactionSavePendingError(err));
    }
}

// Action watchers

function* watchTransactionAddToQueue () {
    yield takeEvery(types.TRANSACTION_ADD_TO_QUEUE, transactionAddToQueue);
}

function* watchTransactionDeletePeding () {
    yield takeEvery(types.TRANSACTION_DELETE_PENDING, transactionDeletePending);
}

function* watchTransactionGetMined () {
    yield takeEvery(types.TRANSACTION_GET_MINED, transactionGetMined);
}

function* watchTransactionGetPending () {
    yield takeEvery(types.TRANSACTION_GET_PENDING, transactionGetPending);
}

// Channel watchers

function* watchTransactionAddToQueueChannel () {
    while (true) {
        const resp = yield take(actionChannels.tx.addToQueue);
        if (resp.error) {
            yield put(actions.transactionAddToQueueError(resp.error));
        } else {
            yield fork(transactionSavePending, resp.request);
        }
    }
}

function* watchTransactionEmitMinedChannel () {
    while (true) {
        const resp = yield take(actionChannels.tx.emitMined);
        if (resp.error) {
            yield put(actions.transactionEmitMinedError(resp.error));
        } else {
            const pendingTx = yield select(selectPendingTx, resp.data.mined);
            const { mined, watching, ...minedTx } = resp.data;
            minedTx.tx = mined;
            if (pendingTx) {
                minedTx.akashaId = pendingTx.get('akashaId');
                minedTx.extra = pendingTx.get('extra');
                minedTx.type = pendingTx.get('type');
            }
            yield fork(transactionSaveMined, minedTx);
            yield put(profileActions.profileGetBalance());
        }
    }
}

export function* registerTransactionListeners () {
    yield fork(watchTransactionAddToQueueChannel);
    yield fork(watchTransactionEmitMinedChannel);
}

export function* watchTransactionActions () {
    yield fork(watchTransactionAddToQueue);
    yield fork(watchTransactionDeletePeding);
    yield fork(watchTransactionGetMined);
    yield fork(watchTransactionGetPending);
}
