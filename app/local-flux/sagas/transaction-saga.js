import { apply, call, fork, put, select, take, takeEvery } from 'redux-saga/effects';
import { actionChannels, enableChannel } from './helpers';
import * as profileActions from '../actions/profile-actions';
import * as actions from '../actions/transaction-actions';
import * as types from '../constants';
import { selectLoggedAkashaId } from '../selectors';
import * as transactionService from '../services/transaction-service';

const Channel = global.Channel;

function* getMinedTransactionInfo (txs) {
    const pendingTxs = yield select(state => state.transactionState.get('pending'));
    const result = [];
    txs.forEach((tx) => { // eslint-disable-line consistent-return
        const hash = tx.mined || tx.transactionHash;
        if (!tx || !pendingTxs.get(hash)) {
            return null;
        }
        const pending = pendingTxs.get(hash).toJS();
        pending.blockNr = tx.blockNumber;
        pending.cumulativeGasUsed = tx.cumulativeGasUsed;
        result.push(pending);
    });
    return result;
}

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
        const pending = yield apply(
            transactionService,
            transactionService.transactionGetPending,
            [akashaId]
        );
        yield put(actions.transactionGetPendingSuccess(pending));
        if (pending.length) {
            const txs = pending.map(tx => tx.tx);
            yield put(actions.transactionGetStatus(txs));
        }
    } catch (err) {
        yield put(actions.transactionGetPendingError(err));
    }
}

export function* transactionGetStatus ({ txs }) {
    const channel = Channel.server.tx.getTransaction;
    yield apply(channel, channel.send, [{ transactionHash: txs }]);
}

function* transactionSaveMined (txs) {
    try {
        yield apply(transactionService, transactionService.transactionSaveMined, [txs]);
        console.log('transaction save mined', txs);
        yield put(actions.transactionEmitMinedSuccess(txs));
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

function* watchTransactionGetStatus () {
    yield takeEvery(types.TRANSACTION_GET_STATUS, transactionGetStatus);
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
            const txs = yield call(getMinedTransactionInfo, [resp.data]);
            console.log('emit mined');
            console.log('data', resp.data);
            console.log('txs', txs);
            yield fork(transactionSaveMined, txs);
            yield put(profileActions.profileGetBalance());
        }
    }
}

function* watchTransactionGetStatusChannel () {
    while (true) {
        const resp = yield take(actionChannels.tx.getTransaction);
        if (resp.error) {
            yield put(actions.transactionGetStatusError(resp.error));
        } else {
            const txs = yield call(getMinedTransactionInfo, resp.data);
            yield fork(transactionSaveMined, txs);
        }
    }
}

export function* registerTransactionListeners () {
    yield fork(watchTransactionAddToQueueChannel);
    yield fork(watchTransactionEmitMinedChannel);
    yield fork(watchTransactionGetStatusChannel);
}

export function* watchTransactionActions () {
    yield fork(watchTransactionAddToQueue);
    yield fork(watchTransactionDeletePeding);
    yield fork(watchTransactionGetMined);
    yield fork(watchTransactionGetPending);
    yield fork(watchTransactionGetStatus);
}
