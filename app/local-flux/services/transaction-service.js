import { ipcRenderer } from 'electron';
import debug from 'debug';
import BaseService from './base-service';
import transactionsDB from './db/transactions';

const Channel = window.Channel;
const dbg = debug('App:TransactionService:');

/**
 * Transaction Service
 * Default managed channels => ['addToQueue', 'emitMined']
 * channels => ['manager', 'addToQueue', 'emitMined']
 */
class TransactionService extends BaseService {
    constructor () {
        super();
        this.serverManager = Channel.server.tx.manager;
        this.clientManager = Channel.client.tx.manager;
    }
    /**
     * Add a transaction to a queue to be notified when it`s mined
     * Request:
     * @param tx <String> a transaction hash
     * Response:
     * @param data = {watching: Boolean}
     */
    addToQueue = ({ tx, onError, onSuccess }) => {
        const serverChannel = Channel.server.tx.addToQueue;
        const clientChannel = Channel.client.tx.addToQueue;
        dbg('adding to queue', tx);

        if (!Array.isArray(tx)) {
            return console.error('tx param should be an array!!');
        }

        return transactionsDB.transaction('rw', transactionsDB.pending, () => {
            return transactionsDB.pending.bulkAdd(tx);
        }).then(() => {
            this.registerListener(clientChannel, this.createListener(onError, onSuccess));
            ipcRenderer.send(serverChannel, tx);
        }).catch(reason => onError(reason));
    };
    /**
     * emit and mined event for a transaction from queue
     * Request:
     * @param watch <Boolean>
     * Response:
     * @param data = { mined: String (optional, a transaction`s tx), watching: Boolean }
     */
    emitMined = ({ watch, onError, onSuccess }) => {
        const serverChannel = Channel.server.tx.emitMined;
        const clientChannel = Channel.client.tx.emitMined;
        const successCB = (data) => {
            transactionsDB.transaction('rw', transactionsDB.pending, transactionsDB.mined, () => {
                transactionsDB.pending.where('tx').equals(data.mined).delete();
                transactionsDB.mined.add({ tx: data.mined });
                return data;
            })
            .then(minedTx => onSuccess(minedTx))
            .catch(reason => onError(reason));
        };
        this.registerListener(clientChannel, this.createListener(onError, successCB));
        ipcRenderer.send(serverChannel, { watch });
    };

    getTransactions = ({ type, onSuccess, onError }) => {
        transactionsDB.transaction('rw', transactionsDB[type], () =>
            transactionsDB[type].toArray()
        )
        .then(data => onSuccess(data))
        .catch(reason => onError(reason));
    };
}

export { TransactionService };
