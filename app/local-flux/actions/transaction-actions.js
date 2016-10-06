import debug from 'debug';
import { transactionActionCreators } from './action-creators';
import { TransactionService } from '../services';

const dbg = debug('App:transactionActions');

let transactionActions = null;

class TransactionActions {
    constructor (dispatch) {
        if (!transactionActions) {
            transactionActions = this;
        }
        this.dispatch = dispatch;
        this.transactionService = new TransactionService();
        return transactionActions;
    }

    listenForMinedTx = ({ watch = true } = {}) => {
        this.transactionService.emitMined({
            watch,
            onSuccess: data => this.dispatch(transactionActionCreators.transactionMinedSuccess(data)),
            onError: error => this.dispatch(transactionActionCreators.transactionMinedError(error))
        });
    }

    addToQueue = (txs) => {
        this.transactionService.addToQueue({
            txs,
            onError: error => this.dispatch(transactionActionCreators.addToQueueError(error)),
            onSuccess: data => this.dispatch(transactionActionCreators.addToQueueSuccess(data))
        });
    }

    getMinedTransactions = () => {
        this.transactionService.getTransactions({
            type: 'mined',
            onError: (error) => {
                this.dispatch(transactionActionCreators.getMinedTransactionsError(error.message));
            },
            onSuccess: (data) => {
                this.dispatch(transactionActionCreators.getMinedTransactionsSuccess(data));
            }
        });
    }

    getPendingTransactions = () => {
        this.transactionService.getTransactions({
            type: 'pending',
            onError: (error) => {
                this.dispatch(transactionActionCreators.getPendingTransactionsError(error));
            },
            onSuccess: (data) => {
                this.dispatch(transactionActionCreators.getPendingTransactionsSuccess(data));
            }
        });
    }
}
export { TransactionActions };
