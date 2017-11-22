import { apply, call, fork, put, select, take, takeEvery } from 'redux-saga/effects';
import { actionChannels, enableChannel } from './helpers';
import * as actionActions from '../actions/action-actions';
import * as profileActions from '../actions/profile-actions';
import * as actions from '../actions/transaction-actions';
import * as types from '../constants';
import { selectAction, selectLoggedAkashaId } from '../selectors';
import * as actionService from '../services/action-service';
import * as actionStatus from '../../constants/action-status';

const Channel = global.Channel;

function* transactionAddToQueue ({ txs }) {
    const channel = Channel.server.tx.addToQueue;
    yield call(enableChannel, channel, Channel.client.tx.manager);
    const akashaId = yield select(selectLoggedAkashaId);
    txs.forEach((tx) => { tx.akashaId = akashaId; });
    yield apply(channel, channel.send, [txs]);
}

function* transactionEmitMinedSuccess (data) {
    console.error('transaction emit mined is depracated');
    const { blockNumber, cumulativeGasUsed } = data;
    const loggedAkashaId = yield select(selectLoggedAkashaId);
    const actionId = yield apply(actionService, actionService.getActionByTx, [data.mined]);
    const action = yield select(state => selectAction(state, actionId)); // eslint-disable-line
    if (action && action.get('akashaId') === loggedAkashaId) {
        const changes = { id: actionId, blockNumber, cumulativeGasUsed, status: actionStatus.published };
        yield put(actionActions.actionUpdate(changes));
        yield put(profileActions.profileGetBalance());
    }
}

export function* transactionGetStatus ({ txs, ids }) {
    const channel = Channel.server.tx.getTransaction;
    yield apply(channel, channel.send, [{ transactionHash: txs, actionIds: ids }]);
}

// Action watchers

function* watchTransactionAddToQueue () {
    yield takeEvery(types.TRANSACTION_ADD_TO_QUEUE, transactionAddToQueue);
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
        }
    }
}

function* watchTransactionEmitMinedChannel () {
    while (true) {
        const resp = yield take(actionChannels.tx.emitMined);
        if (resp.error) {
            yield put(actions.transactionEmitMinedError(resp.error));
        } else {
            yield fork(transactionEmitMinedSuccess, resp.data);
        }
    }
}

function* watchTransactionGetStatusChannel () {
    while (true) {
        const resp = yield take(actionChannels.tx.getTransaction);
        if (resp.error) {
            yield put(actions.transactionGetStatusError(resp.error));
        } else {
            const updates = [];
            const actionIds = [];
            resp.data.forEach((tx, index) => {
                if (!tx) {
                    actionIds.push(resp.request.actionIds[index]);
                }
                if (tx && tx.blockNumber) {
                    const { blockNumber, cumulativeGasUsed } = tx;
                    const id = resp.request.actionIds[index];
                    const changes = { id, blockNumber, cumulativeGasUsed, status: actionStatus.published };
                    updates.push(changes);
                }
            });
            for (let i = 0; i < updates.length; i++) {
                yield put(actionActions.actionUpdate(updates[i]));
            }
            for (let i = 0; i < actionIds.length; i++) {
                yield put(actionActions.actionDelete(actionIds[i]));
            }
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
    yield fork(watchTransactionGetStatus);
}
