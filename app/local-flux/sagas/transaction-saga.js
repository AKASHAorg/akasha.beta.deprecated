import { apply, fork, put, take, takeEvery } from 'redux-saga/effects';
import { actionChannels } from './helpers';
import * as actionActions from '../actions/action-actions';
import * as actions from '../actions/transaction-actions';
import * as types from '../constants';
import * as actionStatus from '../../constants/action-status';

const Channel = global.Channel;

export function* transactionGetStatus ({ txs, ids }) {
    const channel = Channel.server.tx.getTransaction;
    yield apply(channel, channel.send, [{ transactionHash: txs, actionIds: ids }]);
}

function* watchTransactionGetStatus () {
    yield takeEvery(types.TRANSACTION_GET_STATUS, transactionGetStatus);
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
                    const { blockNumber, cumulativeGasUsed, success } = tx;
                    const id = resp.request.actionIds[index];
                    const changes = {
                        id,
                        blockNumber,
                        cumulativeGasUsed,
                        status: actionStatus.published,
                        success
                    };
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
    yield fork(watchTransactionGetStatusChannel);
}

export function* watchTransactionActions () {
    yield fork(watchTransactionGetStatus);
}
