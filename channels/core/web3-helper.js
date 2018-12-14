import * as Promise from 'bluebird';
import { CORE_MODULE, buildCall, TX_MODULE } from '@akashaproject/common/constants';
export default function init(sp, getService) {
    class Web3Helper {
        constructor() {
            this.txQueue = new Map();
            this.syncing = true;
            this.watching = false;
        }
        setChannel(channel) {
            this.channel = channel;
            this.args = buildCall(TX_MODULE, TX_MODULE.emitMined, {});
        }
        inSync() {
            const rules = [
                getService(CORE_MODULE.WEB3_API).instance.eth.getSyncing(),
                getService(CORE_MODULE.WEB3_API).instance.net.getPeerCount(),
            ];
            return Promise.all(rules).then((data) => {
                const timeStamp = Math.floor(new Date().getTime() / 1000);
                if (data[0]) {
                    return [data[1], data[0]];
                }
                if (!data[0] && data[1] > 0) {
                    return (getService(CORE_MODULE.WEB3_API)).instance
                        .eth
                        .getBlock('latest')
                        .then((latestBlock) => {
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
        startTxWatch() {
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
            const currentQueue = [];
            this.watching = true;
            if (this.watcher) {
                return Promise.resolve(this.watching);
            }
            this.watcher = getService(CORE_MODULE.WEB3_API).instance.eth.filter('latest');
            this.watcher.watch((err, block) => {
                if (err) {
                    return;
                }
                for (const hash of this.getCurrentTxQueue()) {
                    currentQueue.push(getService(CORE_MODULE.WEB3_API).instance
                        .eth.getTransactionReceipt(hash));
                }
                Promise.all(currentQueue).then((receipt) => {
                    receipt.forEach((tx) => {
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
                                args: this.args,
                            });
                        }
                    });
                });
            });
            return Promise.resolve(this.watching);
        }
        hasKey(address) {
            return getService(CORE_MODULE.WEB3_API).instance
                .eth
                .getAccounts()
                .then((list) => {
                return list.indexOf(address) !== -1;
            });
        }
        stopTxWatch() {
            this.watching = false;
            return (this.watcher) ? this.watcher.stopWatching(() => {
                this.watcher = null;
            }) : '';
        }
        addTxToWatch(tx, autoWatch = true) {
            this.txQueue.set(tx, '');
            if (!this.watching && autoWatch) {
                this.startTxWatch();
            }
            return this;
        }
        getCurrentTxQueue() {
            return this.txQueue.keys();
        }
    }
    const web3Helper = new Web3Helper();
    const service = function () {
        return web3Helper;
    };
    sp().service(CORE_MODULE.WEB3_HELPER, service);
}
//# sourceMappingURL=web3-helper.js.map