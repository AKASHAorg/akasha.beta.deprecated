const initContracts = require('@akashaproject/contracts.js');
import { GethConnector } from '@akashaproject/geth-connector';
import { descend, filter, last, prop, sortWith, take, uniq } from 'ramda';
import auth from '../modules/auth/Auth';

class Contracts {
    public instance: any;

    /**
     * Init web3 contract js bindings
     * @returns {Promise<any>}
     */
    public async init() {
        this.instance = await initContracts(GethConnector.getInstance().web3.currentProvider);
        return this.instance;
    }

    public async send(data: any, token: string, cb) {
        const tx = await auth.signData(data.params[0], token);
        cb(null, { tx });
        return Contracts.watchTx(tx);
    }

    public static watchTx(tx: string) {
        const timeout = 300000;
        const start = new Date().getTime();
        return new Promise((resolve, reject) => {
            const getReceipt = function () {
                GethConnector.getInstance().web3
                    .eth.getTransactionReceipt(tx, (err, receipt) => {
                    if (receipt != null) {
                        return resolve({
                            tx: tx,
                            receipt: {
                                gasUsed: receipt.gasUsed,
                                cumulativeGasUsed: receipt.cumulativeGasUsed,
                                transactionHash: receipt.transactionHash,
                                blockNumber: receipt.blockNumber,
                                success: receipt.status === '0x1'
                            }
                        });
                    }

                    if (new Date().getTime() - start > timeout) {
                        return reject(new Error('Tx: ' + tx + ' timed out'));
                    }

                    setTimeout(getReceipt, 2000);
                });

            };
            getReceipt();
        });
    }

    public fromEvent(ethEvent: any, args: any, toBlock: number | string, limit: number,
                     options: { lastIndex?: number, reversed?: boolean }) {
        const step = 5300;
        return new Promise((resolve, reject) => {
            let results = [];
            let filterIndex;
            if (!options.reversed) {
                filterIndex = (record) => record.blockNumber < toBlock ||
                    (record.blockNumber === toBlock && record.logIndex < options.lastIndex);
            } else {
                filterIndex = (record) => record.blockNumber > toBlock;
            }

            const fetch = (to) => {
                let fromBlock = (options.reversed) ? toBlock : to - step;
                if (fromBlock < 0) {
                    fromBlock = 0;
                }
                const event = ethEvent(args, { fromBlock, toBlock: (options.reversed) ? 'latest' : to });
                event.get((err, data) => {
                    if (err) {
                        return reject(err);
                    }
                    const filteredData = (options.lastIndex) ? filter(filterIndex, data) : data;

                    results = uniq(results.concat(filteredData));
                    if (results.length < limit && fromBlock > 0 && !options.reversed) {
                        return fetch(fromBlock);
                    }

                    const sortedResults = take(limit,
                        sortWith([descend(prop('blockNumber')),
                                descend(prop('logIndex'))],
                            results));
                    const lastLog = last(sortedResults);
                    const lastIndex = lastLog ? lastLog.logIndex : 0;
                    const lastBlock = lastLog ? (sortedResults.length === limit && fromBlock !== 0) ? lastLog.blockNumber : 0 : 0;
                    return resolve({ results: sortedResults, fromBlock: lastBlock, lastIndex });
                });
            };
            fetch(toBlock);
        });

    }

    public fromEventFilter(ethEvent: any, args: any, toBlock: number | string, limit: number,
                           options: { lastIndex?: number, reversed?: boolean }, aditionalFilter: (data) => boolean) {
        const step = 8300;
        return new Promise((resolve, reject) => {
            let results = [];
            let filterIndex;
            if (!options.reversed) {
                filterIndex = (record) => record.blockNumber < toBlock ||
                    (record.blockNumber === toBlock && record.logIndex < options.lastIndex);
            } else {
                filterIndex = (record) => record.blockNumber > toBlock;
            }
            const fetch = (to) => {
                let fromBlock = (options.reversed) ? toBlock : to - step;
                if (fromBlock < 0) {
                    fromBlock = 0;
                }
                const event = ethEvent(args, { fromBlock, toBlock: (options.reversed) ? 'latest' : to });
                event.get((err, data) => {
                    if (err) {
                        return reject(err);
                    }

                    const filteredData = filter(aditionalFilter, filter(filterIndex, data));
                    results = uniq(results.concat(filteredData));
                    if (results.length < limit && fromBlock > 0 && !options.reversed) {
                        return fetch(fromBlock);
                    }

                    const sortedResults = take(limit,
                        sortWith([descend(prop('blockNumber')),
                                descend(prop('logIndex'))],
                            results));
                    const lastLog = last(sortedResults);
                    const lastIndex = lastLog ? lastLog.logIndex : 0;
                    const lastBlock = lastLog ? (sortedResults.length === limit && fromBlock !== 0) ? lastLog.blockNumber : 0 : 0;
                    return resolve({ results: sortedResults, fromBlock: lastBlock, lastIndex });
                });
            };
            fetch(toBlock);
        });

    }

}

export default new Contracts();
