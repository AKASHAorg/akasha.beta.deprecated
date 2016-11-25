import { profileActionCreators, transactionActionCreators } from './action-creators';
import { ProfileService, TransactionService } from '../services';

let transactionActions = null;

class TransactionActions {
    constructor (dispatch) {
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
            deletingPendingTx: true
        }));
        this.transactionService.deletePendingTx({
            tx,
            onSuccess: () =>
                this.dispatch(transactionActionCreators.deletePendingTxSuccess(tx, {
                    deletingPendingTx: false
                })),
            onError: reason =>
                this.dispatch(transactionActionCreators.deletePendingTxError(reason, {
                    deletingPendingTx: false
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
