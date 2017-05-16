import { profileActionCreators, transactionActionCreators } from './action-creators';
import { ProfileService, TransactionService } from '../services';
import * as types from '../constants';
import { action } from './helpers';

let transactionActions = null;

class TransactionActions {
    constructor (dispatch) { // eslint-disable-line consistent-return
        if (transactionActions) {
            return transactionActions;
        }
        this.dispatch = dispatch;
        this.profileService = new ProfileService();
        this.transactionService = new TransactionService();
        transactionActions = this;
    }

    listenForMinedTx = ({ watch = true } = {}) => {
        this.dispatch((dispatch, getState) => {
            const profileAddress = getState().profileState.getIn(['loggedProfile', 'profile']) || '';
            this.transactionService.emitMined({
                watch,
                options: { profile: profileAddress },
                onSuccess: (data) => {
                    this.dispatch(transactionActionCreators.transactionMinedSuccess(data));
                    const profileKey = getState().profileState.getIn(['loggedProfile', 'account']);
                    if (!profileKey) {
                        return;
                    }
                    this.profileService.getProfileBalance({
                        options: {
                            etherBase: profileKey
                        },
                        onSuccess: balance =>
                            this.dispatch(profileActionCreators.getProfileBalanceSuccess(balance)),
                        onError: error =>
                            this.dispatch(profileActionCreators.getProfileBalanceError(error))
                    });
                },
                onError: error =>
                    this.dispatch(transactionActionCreators.transactionMinedError(error))
            });
        });
    };

    deletePendingTx = (tx) => {
        this.dispatch(transactionActionCreators.deletePendingTx({
            deletingPendingTx: { tx, value: true }
        }));
        this.transactionService.deletePendingTx({
            tx,
            onSuccess: () =>
                this.dispatch(transactionActionCreators.deletePendingTxSuccess(tx, {
                    deletingPendingTx: { tx, value: false }
                })),
            onError: reason =>
                this.dispatch(transactionActionCreators.deletePendingTxError(reason, {
                    deletingPendingTx: { tx, value: false }
                }))
        });
    };

    addToQueue = (txs) => {
        this.dispatch((dispatch, getState) => {
            const profileAddress = getState().profileState.getIn(['loggedProfile', 'profile']) || '';
            if (Array.isArray(txs)) {
                txs.forEach((tx) => { tx.profile = profileAddress; });
            }
            this.transactionService.addToQueue({
                txs,
                onError: error => dispatch(transactionActionCreators.addToQueueError(error)),
                onSuccess: data => dispatch(transactionActionCreators.addToQueueSuccess(data))
            });
        });
    }

    getMinedTransactions = () => {
        this.dispatch(transactionActionCreators.getMinedTransactions());
        this.dispatch((dispatch, getState) => {
            const profileAddress = getState().profileState.getIn(['loggedProfile', 'profile']) || '';
            this.transactionService.getTransactions({
                type: 'mined',
                options: { profile: profileAddress },
                onError: (error) => {
                    this.dispatch(
                        transactionActionCreators.getMinedTransactionsError(error.message)
                    );
                },
                onSuccess: (data) => {
                    this.dispatch(transactionActionCreators.getMinedTransactionsSuccess(data));
                }
            });
        });
    }

    /**
     * @param options = { type: 'updateProfile' }
     */
    getPendingTransactions = (options) => {
        this.dispatch(transactionActionCreators.getPendingTransactions());
        this.dispatch((dispatch, getState) => {
            const profileAddress = getState().profileState.getIn(['loggedProfile', 'profile']) || '';
            this.transactionService.getTransactions({
                type: 'pending',
                options: { ...options, profile: profileAddress },
                onError: (error) => {
                    this.dispatch(transactionActionCreators.getPendingTransactionsError(error));
                },
                onSuccess: (data) => {
                    this.dispatch(transactionActionCreators.getPendingTransactionsSuccess(data));
                }
            });
        });
    }
}

export { TransactionActions };

export const transactionAddToQueue = txs => action(types.TRANSACTION_ADD_TO_QUEUE, { txs });

export const transactionAddToQueueError = (error) => {
    error.code = 'TATQE01';
    error.messageId = 'transactionAddToQueue';
    return action(types.TRANSACTION_ADD_TO_QUEUE_ERROR, { error });
};

export const transactionAddToQueueSuccess = request =>
    action(types.TRANSACTION_ADD_TO_QUEUE_SUCCESS, { request });
export const transactionDeletePending = tx => action(types.TRANSACTION_DELETE_PENDING, { tx });

export const transactionDeletePendingError = (error, tx) => {
    error.code = 'TDPE01';
    error.messageId = 'transactionDeletePending';
    return action(types.TRANSACTION_DELETE_PENDING_ERROR, { error, tx });
};

export const transactionDeletePendingSuccess = data =>
    action(types.TRANSACTION_DELETE_PENDING_SUCCESS, { data });
export const transactionEmitMinedError = (error) => {
    error.code = 'TEME01';
    error.messageId = 'transactionEmitMined';
    return action(types.TRANSACTION_EMIT_MINED_ERROR, { error });
};

export const transactionEmitMinedSuccess = data =>
    action(types.TRANSACTION_EMIT_MINED_SUCCESS, { data });
export const transactionGetMined = () => action(types.TRANSACTION_GET_MINED);

export const transactionGetMinedError = (error) => {
    error.code = 'TGME01';
    error.messageId = 'transactionGetMined';
    return action(types.TRANSACTION_GET_MINED_ERROR, { error });
};

export const transactionGetMinedSuccess = data =>
    action(types.TRANSACTION_GET_MINED_SUCCESS, { data });
export const transactionGetPending = () => action(types.TRANSACTION_GET_PENDING);

export const transactionGetPendingError = (error) => {
    error.code = 'TGPE01';
    error.messageId = 'transactionGetPending';
    return action(types.TRANSACTION_GET_PENDING_ERROR, { error });
};

export const transactionGetPendingSuccess = data =>
    action(types.TRANSACTION_GET_PENDING_SUCCESS, { data });
export const transactionGetStatus = txs => action(types.TRANSACTION_GET_STATUS, { txs });

export const transactionGetStatusError = (error) => {
    error.code = 'TGSE01';
    error.messageId = 'transactionGetStatus';
    return action(types.TRANSACTION_GET_STATUS_ERROR, { error });
};

export const transactionGetStatusSuccess = data =>
    action(types.TRANSACTION_GET_STATUS_SUCCESS, { data });
export const transactionSavePendingError = (error) => {
    error.code = 'TSPE01';
    error.messageId = 'transactionSavePending';
    return action(types.TRANSACTION_SAVE_PENDING_ERROR, { error });
};
