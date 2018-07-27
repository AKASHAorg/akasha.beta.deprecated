import * as Promise from 'bluebird';
import { CORE_MODULE } from '@akashaproject/common/constants';

export default function init(sp, getService) {
  class Web3Helper {
    public watcher: any;
    public txQueue = new Map();
    public syncing: boolean = true;
    public watching = false;
    private channel: any;

    // ex: rx.js channel with send method
    public setChannel(channel: any) {
      this.channel = channel;
    }

    // check if current used node is synchronized
    public inSync() {
      const rules = [
        getService(CORE_MODULE.WEB3_API).instance.eth.getSyncingAsync(),
        getService(CORE_MODULE.WEB3_API).instance.net.getPeerCountAsync(),
      ];

      return Promise.all(rules).then((data) => {
        const timeStamp = Math.floor(new Date().getTime() / 1000);
        if (data[0]) {
          return [data[1], data[0]];
        }

        if (!data[0] && data[1] > 0) {
          return getService(CORE_MODULE.WEB3_API).instance
            .eth
            .getBlockAsync('latest')
            .then((latestBlock: any): any => {
              if ((latestBlock.timestamp + 60 * 2) > timeStamp) {
                this.syncing = false;
                return [];
              }
              return [data[1]];
            });
        }

        return [data[1]];
      });
    }

    // watch every block until all tx queue is mined
    public startTxWatch(): any {
      if (this.syncing) {
        return this.inSync().then(() => {
          if (this.syncing) {
            throw new Error('Geth node is syncing, try calling #inSync() before this');
          }
          return this.startTxWatch();
        });
      }
      if (this.txQueue.size === 0) {
        return;
      }

      const currentQueue: string[] = [];
      this.watching = true;
      if (this.watcher) {
        return Promise.resolve(this.watching);
      }

      this.watcher = getService(CORE_MODULE.WEB3_API).instance.eth.filter('latest');
      this.watcher.watch((err: any, block: any) => {
        if (err) {
          return;
        }
        for (const hash of this.getCurrentTxQueue()) {
          currentQueue.push(
            getService(CORE_MODULE.WEB3_API).instance
              .eth.getTransactionReceiptAsync(hash),
          );
        }
        Promise.all(currentQueue).then((receipt: any[]) => {
          receipt.forEach((tx: any) => {
            if (tx) {
              this.txQueue.delete(tx.transactionHash);
              if (this.txQueue.size === 0) {
                this.stopTxWatch();
              }

              this.channel.send({
                data: {
                  mined: tx.transactionHash,
                  blockNumber: tx.blockNumber,
                  cumulativeGasUsed: tx.cumulativeGasUsed,
                  hasEvents: !!(tx.logs.length),
                  watching: this.watching,
                },
              });
            }
          });
        });
      });
      return Promise.resolve(this.watching);
    }

    // check if local node has access to provided address
    public hasKey(address: string) {
      return getService(CORE_MODULE.WEB3_API).instance
        .eth
        .getAccountsAsync()
        .then((list: string[]) => {
          return list.indexOf(address) !== -1;
        });
    }

    public stopTxWatch() {
      this.watching = false;
      return (this.watcher) ? this.watcher.stopWatching(() => {
        this.watcher = null;
      }) : '';
    }

    // add tx to current queue
    public addTxToWatch(tx: string, autoWatch = true) {
      this.txQueue.set(tx, '');
      if (!this.watching && autoWatch) {
        this.startTxWatch();
      }
      return this;
    }

    // get current tx list
    public getCurrentTxQueue() {
      return this.txQueue.keys();
    }
  }

  const web3Helper = new Web3Helper();
  const service = function () {
    return web3Helper;
  };
  sp().service(CORE_MODULE.WEB3_HELPER, service);
}
