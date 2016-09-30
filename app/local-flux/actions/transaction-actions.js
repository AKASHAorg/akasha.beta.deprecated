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
            onSuccess: data => this.dispatch(transactionActionCreators.transactionMined(data)),
            onError: error => this.dispatch(transactionActionCreators.transactionMinedError(error))
        });
    }

    addToQueue = (tx) => {
        this.transactionService.addToQueue({
            tx,
            onError: error => this.dispatch(transactionActionCreators.addToQueueError(error)),
            onSuccess: data => this.dispatch(transactionActionCreators.addToQueueSuccess(data))
        });
    }

    getMinedTransactions = () => {
        this.transactionService.getTransactions({
            type: 'mined',
            onError: (error) => {
                console.log(error, 'error');
                this.dispatch(transactionActionCreators.getMinedTransactionsError(error.message));
            },
            onSuccess: (data) => {
                console.log('success', data);
                this.dispatch(transactionActionCreators.getMinedTransactionsSuccess(data));
            }
        });
    }

    getPendingTransactions = () => {
        this.transactionService.getTransactions({
            type: 'pending',
            onError: (error) => {
                console.log(error, 'an error');
                this.dispatch(transactionActionCreators.getPendingTransactionsError(error));
            },
            onSuccess: (data) => {
                this.dispatch(transactionActionCreators.getPendingTransactionsSuccess(data));
            }
        });
    }
}
export { TransactionActions };
