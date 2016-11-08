import BaseService from './base-service';
import transactionsDB from './db/transactions';

const Channel = window.Channel;

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

        if (!Array.isArray(txs)) {
            return console.error('tx param should be an array!!');
        }
        const successCB = () => {
            transactionsDB.transaction('rw', transactionsDB.pending, () =>
                transactionsDB.pending.bulkPut(txs)
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
        return serverChannel.send(txs);
    };
    /**
     * emit and mined event for a transaction from queue
     * Request:
     * @param watch <Boolean>
     * @param options = { profile: <string> }
     * Response:
     * @param data = { mined: String (optional, a transaction`s tx), watching: Boolean }
     */
    emitMined = ({ watch, options, onError, onSuccess }) => {
        const serverChannel = Channel.server.tx.emitMined;
        const clientChannel = Channel.client.tx.emitMined;
        const successCB = (data) => {
            if (data && data.mined) {
                transactionsDB.transaction('rw', transactionsDB.pending, transactionsDB.mined, () => {
                    transactionsDB.mined.put({
                        tx: data.mined,
                        profile: options.profile,
                        blockNumber: data.blockNumber,
                        cumulativeGasUsed: data.cumulativeGasUsed,
                        hasEvents: data.hasEvents
                    });
                    return data;
                })
                .then((minedTx) => {
                    onSuccess(minedTx);
                })
                .catch((reason) => {
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

    deletePendingTx = ({ tx, onError = () => {}, onSuccess }) => {
        transactionsDB.transaction('rw', transactionsDB.pending, transactionsDB.mined, () => {
            transactionsDB.pending.where('tx').equals(tx).delete();
        })
        .then(() => onSuccess(tx))
        .catch(reason => onError(reason));
    };

    getTransactions = ({ type, options = {}, onSuccess, onError }) => {
        transactionsDB.transaction('rw', transactionsDB[type], () => {
            if (type !== 'pending' || !options.type) {
                return transactionsDB[type].where('profile').equals(options.profile).toArray();
            }
            return transactionsDB[type].where('type+profile')
                .equals([options.type, options.profile]).toArray();
        })
        .then(data => onSuccess(data))
        .catch(reason => onError(reason));
    };
}

export { TransactionService };
