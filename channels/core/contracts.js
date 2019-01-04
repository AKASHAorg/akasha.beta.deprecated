"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BlPromise = require("bluebird");
const hash = require("object-hash");
const initContracts = require("@akashaproject/contracts.js");
const ramda_1 = require("ramda");
const constants_1 = require("@akashaproject/common/constants");
function init(sp, getService) {
    class Contracts {
        constructor() {
            this.watchers = [];
        }
        async init() {
            this.instance = await initContracts(getService(constants_1.CORE_MODULE.WEB3_API).instance.currentProvider);
        }
        reset() {
            this.instance = null;
        }
        send(data, token, cb) {
            return (getService(constants_1.AUTH_MODULE.auth)).signData(data.params[0], token)
                .once('transactionHash', function (txHash) {
                cb(null, { tx: txHash });
            })
                .once('error', function (error) {
                cb(error);
            });
        }
        createWatcher(ethEvent, args, fromBlock) {
            const currentWatcher = ethEvent(args, { fromBlock });
            this.watchers.push(currentWatcher);
            return currentWatcher;
        }
        stopAllWatchers() {
            this.watchers.forEach((watcher) => {
                return watcher.stopWatching(() => {
                });
            });
            this.watchers.length = 0;
            return BlPromise.delay(1000);
        }
        fromEvent(ethEvent, args, toBlock, limit, options) {
            const step = 5300;
            const hashedEvent = hash(Array.from(arguments));
            if (getService(constants_1.CORE_MODULE.STASH).eventCache.hasFull(hashedEvent) &&
                !options.reversed) {
                return Promise.resolve(getService(constants_1.CORE_MODULE.STASH).eventCache.getFull(hashedEvent));
            }
            return new Promise((resolve, reject) => {
                let results = [];
                let filterIndex;
                if (!options.reversed) {
                    filterIndex = record => record.blockNumber < toBlock ||
                        (record.blockNumber === toBlock && record.logIndex < options.lastIndex);
                }
                else {
                    filterIndex = record => record.blockNumber > toBlock;
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
                        const filteredData = (!ramda_1.isNil(options.lastIndex))
                            ? ramda_1.filter(filterIndex, data) : data;
                        results = ramda_1.uniq(results.concat(filteredData));
                        if (results.length < limit && fromBlock > 0 && !options.reversed) {
                            if (!options.stopOnFirst || !results.length) {
                                return fetch(fromBlock);
                            }
                        }
                        const sortedResults = ramda_1.take(limit, ramda_1.sortWith([
                            ramda_1.descend(ramda_1.prop('blockNumber')),
                            ramda_1.descend(ramda_1.prop('logIndex')),
                        ], results));
                        const lastLog = options.reversed ?
                            ramda_1.head(sortedResults) : ramda_1.last(sortedResults);
                        const lastIndex = lastLog ? lastLog.logIndex : 0;
                        let lastBlock;
                        if (options.reversed) {
                            lastBlock = lastLog ? lastLog.blockNumber : fromBlock;
                        }
                        else {
                            lastBlock = lastLog ?
                                (sortedResults.length === limit && fromBlock !== 0) ?
                                    lastLog.blockNumber : 0 : 0;
                        }
                        const result = { results: sortedResults, fromBlock: lastBlock, lastIndex };
                        getService(constants_1.CORE_MODULE.STASH).eventCache.setFull(hashedEvent, result);
                        return resolve(result);
                    });
                };
                fetch(toBlock);
            });
        }
        fromEventFilter(ethEvent, args, toBlock, limit, options, aditionalFilter) {
            const step = 8300;
            const hashedEvent = hash(Array.from(arguments));
            if (getService(constants_1.CORE_MODULE.STASH).eventCache.hasFull(hashedEvent) &&
                !options.reversed) {
                return Promise.resolve(getService(constants_1.CORE_MODULE.STASH).eventCache.getFull(hashedEvent));
            }
            return new Promise((resolve, reject) => {
                let results = [];
                let filterIndex;
                if (!options.reversed) {
                    filterIndex = record => record.blockNumber < toBlock ||
                        (record.blockNumber === toBlock && record.logIndex < options.lastIndex);
                }
                else {
                    filterIndex = record => record.blockNumber > toBlock;
                }
                const fetch = (to) => {
                    let fromBlock = (options.reversed) ? toBlock : to - step;
                    if (fromBlock < 0) {
                        fromBlock = 0;
                    }
                    const event = ethEvent(args, {
                        fromBlock,
                        toBlock: (options.reversed) ? 'latest' : to,
                    });
                    event.get((err, data) => {
                        if (err) {
                            return reject(err);
                        }
                        const filteredData = ramda_1.filter(aditionalFilter, ramda_1.filter(filterIndex, data));
                        results = ramda_1.uniq(results.concat(filteredData));
                        if (results.length < limit && fromBlock > 0 && !options.reversed) {
                            return fetch(fromBlock);
                        }
                        const sortedResults = ramda_1.take(limit, ramda_1.sortWith([
                            ramda_1.descend(ramda_1.prop('blockNumber')),
                            ramda_1.descend(ramda_1.prop('logIndex')),
                        ], results));
                        const lastLog = options.reversed ?
                            ramda_1.head(sortedResults) : ramda_1.last(sortedResults);
                        const lastIndex = lastLog ? lastLog.logIndex : 0;
                        let lastBlock;
                        if (options.reversed) {
                            lastBlock = lastLog ? lastLog.blockNumber : fromBlock;
                        }
                        else {
                            lastBlock = lastLog ?
                                (sortedResults.length === limit && fromBlock !== 0) ?
                                    lastLog.blockNumber : 0 : 0;
                        }
                        const result = { results: sortedResults, fromBlock: lastBlock, lastIndex };
                        getService(constants_1.CORE_MODULE.STASH).eventCache.setFull(hashedEvent, result);
                        return resolve(result);
                    });
                };
                fetch(toBlock);
            });
        }
    }
    const contracts = new Contracts();
    const service = function () {
        return contracts;
    };
    sp().service(constants_1.CORE_MODULE.CONTRACTS, service);
}
exports.default = init;
//# sourceMappingURL=contracts.js.map