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
    addToQueue = ({ txs, onError, onSuccess }) => {
        const serverChannel = Channel.server.tx.addToQueue;
        const clientChannel = Channel.client.tx.addToQueue;
        dbg('adding to queue', txs);

        if (!Array.isArray(txs)) {
            return console.error('tx param should be an array!!');
        }
        const successCB = (data) => {
            console.log('add to queue data', data);
            transactionsDB.transaction('rw', transactionsDB.pending, () => {
                return transactionsDB
                    .pending
                    .where('tx')
                    .anyOf(txs)
                    .toArray()
                    .then((results) => {
                        txs.forEach((trans) => {
                            if (!!results.find(res => res.tx === trans)) {
                                return transactionsDB.pending.add({ tx: trans });
                            }
                        });
                    });
            })
            .then(onSuccess)
            .catch((reason) => {
                console.log(reason, 'reason to fail');
                onError(reason)
            });
        };
        this.registerListener(clientChannel, this.createListener(onError, successCB));
        ipcRenderer.send(serverChannel, txs.map(tx => ({ tx })));
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
            console.log('is this a mined tx?', data);
            if (data && data.mined) {
                transactionsDB.transaction('rw', transactionsDB.pending, transactionsDB.mined, () => {
                    transactionsDB.pending.where('tx').equals(data.mined).delete();
                    transactionsDB.mined.where('tx').equals(data.mined).toArray().then((results) => {
                        if (!results.find(res => res.tx === data.mined)) {
                            transactionsDB.mined.add({ tx: data.mined });
                        }
                    });
                    return data;
                })
                .then(minedTx => {
                    console.log(minedTx, 'minedTx saved');
                    onSuccess(minedTx);
                })
                .catch(onError);
            }
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
