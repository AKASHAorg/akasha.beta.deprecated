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
            transactionsDB.transaction('rw', transactionsDB.pending, () =>
                transactionsDB.pending.bulkPut(txs.map(tx => ({ tx })))
            )
            .then(() => onSuccess(txs))
            .catch((reason) => {
                onError(reason);
            });
        };
        this.registerListener(
            clientChannel,
            this.createListener(onError, successCB, clientChannel.channelName)
        );
        serverChannel.send(txs.map(tx => ({ tx })));
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
            if (data && data.mined) {
                transactionsDB.transaction('rw', transactionsDB.pending, transactionsDB.mined, () => {
                    transactionsDB.pending.where('tx').equals(data.mined).delete();
                    transactionsDB.mined.put({
                        tx: data.mined,
                        blockNumber: data.blockNumber,
                        cumulativeGasUsed: data.cumulativeGasUsed,
                        hasEvents: data.hasEvents
                    });
                    return data;
                })
                .then(minedTx => {
                    console.log(minedTx, 'minedTx saved');
                    onSuccess(minedTx);
                })
                .catch(reason => {
                    console.error(reason, 'emit mined failed!');
                    onError(reason);
                });
            }
        };
        this.registerListener(
            clientChannel,
            this.createListener(onError, successCB, clientChannel.channelName)
        );
        serverChannel.send({ watch });
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
