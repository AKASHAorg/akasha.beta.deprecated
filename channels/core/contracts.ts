import * as BlPromise from 'bluebird';
import * as hash from 'object-hash';
import * as initContracts from '@akashaproject/contracts.js';
import { descend, filter, head, isNil, last, prop, sortWith, take, uniq } from 'ramda';
import { AUTH_MODULE, CORE_MODULE } from '@akashaproject/common/constants';

export default function init(sp, getService) {

  class Contracts {
    public instance: any;
    public watchers: any[] = [];

    public static watchTx(tx: string) {
      const timeout = 300000;
      const start = new Date().getTime();
      return new BlPromise((resolve, reject) => {
        const getReceipt = function () {
          getService(CORE_MODULE.WEB3_API)
          .instance
          .eth.getTransactionReceipt(tx, (err, receipt) => {
            if (receipt != null) {
              return resolve({
                tx,
                receipt: {
                  gasUsed: receipt.gasUsed,
                  cumulativeGasUsed: receipt.cumulativeGasUsed,
                  transactionHash: receipt.transactionHash,
                  blockNumber: receipt.blockNumber,
                  success: receipt.status === '0x1',
                  logs: receipt.logs,
                },
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

    /**
     * Init web3 contract js bindings
     */
    public async init() {
      this.instance = await initContracts(
        getService(CORE_MODULE.WEB3_API).instance.currentProvider);
    }

    public reset() {
      this.instance = null;
    }

    // send transaction and watch status
    public async send(data: any, token: string, cb) {
      const tx = await getService(AUTH_MODULE.auth).signData(data.params[0], token);
      cb(null, { tx });
      return Contracts.watchTx(tx);
    }

    public createWatcher(ethEvent: any, args: any, fromBlock: number) {
      const currentWatcher = ethEvent(args, { fromBlock });
      this.watchers.push(currentWatcher);
      return currentWatcher;
    }

    public stopAllWatchers() {
      this.watchers.forEach((watcher) => {
        return watcher.stopWatching(() => {
        });
      });
      this.watchers.length = 0;
      return BlPromise.delay(1000);
    }

    public fromEvent(
      ethEvent: any, args: any, toBlock: number | string, limit: number,
      options: { lastIndex?: number, reversed?: boolean, stopOnFirst?: boolean },
    ) {
      const step = 5300;
      const hashedEvent = hash(Array.from(arguments));
      if (getService(CORE_MODULE.STASH).eventCache.hasFull(hashedEvent) &&
        !options.reversed) {
        return Promise.resolve(
          getService(CORE_MODULE.STASH).eventCache.getFull(hashedEvent));
      }
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
          const event = ethEvent(
            args,
            { fromBlock, toBlock: (options.reversed) ? 'latest' : to });
          event.get((err, data) => {
            if (err) {
              return reject(err);
            }
            const filteredData = (!isNil(options.lastIndex))
              ? filter(filterIndex, data) : data; // @_@

            results = uniq(results.concat(filteredData));
            if (results.length < limit && fromBlock > 0 && !options.reversed) {
              if (!options.stopOnFirst || !results.length) {
                return fetch(fromBlock);
              }
            }

            const sortedResults = take(
              limit,
              sortWith(
                [
                  descend(prop('blockNumber')),
                  descend(prop('logIndex')),
                ],
                results),
            );
            const lastLog = options.reversed ?
              head(sortedResults) : last(sortedResults);
            const lastIndex = lastLog ? lastLog.logIndex : 0;
            let lastBlock;
            if (options.reversed) {
              lastBlock = lastLog ? lastLog.blockNumber : fromBlock;
            } else {
              lastBlock = lastLog ?
                (sortedResults.length === limit && fromBlock !== 0) ?
                  lastLog.blockNumber : 0 : 0;
            }
            const result = { results: sortedResults, fromBlock: lastBlock, lastIndex };
            getService(CORE_MODULE.STASH).eventCache.setFull(hashedEvent, result);
            return resolve(result);
          });
        };
        fetch(toBlock);
      });

    }

    public fromEventFilter(ethEvent: any, args: any, toBlock: number | string, limit: number,
                           options: { lastIndex?: number, reversed?: boolean },
                           aditionalFilter: (data) => boolean) {
      const step = 8300;
      const hashedEvent = hash(Array.from(arguments));
      if (getService(CORE_MODULE.STASH).eventCache.hasFull(hashedEvent) &&
        !options.reversed) {
        return Promise.resolve(
          getService(CORE_MODULE.STASH).eventCache.getFull(hashedEvent));
      }
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
          const event = ethEvent(args, {
            fromBlock,
            toBlock: (options.reversed) ? 'latest' : to,
          });
          event.get((err, data) => {
            if (err) {
              return reject(err);
            }

            const filteredData = filter(aditionalFilter, filter(filterIndex, data));
            results = uniq(results.concat(filteredData));
            if (results.length < limit && fromBlock > 0 && !options.reversed) {
              return fetch(fromBlock);
            }

            const sortedResults = take(
              limit,
              sortWith(
                [
                  descend(prop('blockNumber')),
                  descend(prop('logIndex')),
                ],
                results));
            const lastLog = options.reversed ?
              head(sortedResults) : last(sortedResults);
            const lastIndex = lastLog ? lastLog.logIndex : 0;
            let lastBlock;
            if (options.reversed) {
              lastBlock = lastLog ? lastLog.blockNumber : fromBlock;
            } else {
              lastBlock = lastLog ?
                (sortedResults.length === limit && fromBlock !== 0) ?
                  lastLog.blockNumber : 0 : 0;
            }
            const result = { results: sortedResults, fromBlock: lastBlock, lastIndex };
            getService(CORE_MODULE.STASH).eventCache.setFull(hashedEvent, result);
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
  sp().service(CORE_MODULE.CONTRACTS, service);

}
