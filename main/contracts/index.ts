const initContracts = require('@akashaproject/contracts.js');
import { GethConnector } from '@akashaproject/geth-connector';
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
                            receipt: receipt
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

    public fromEvent(ethEvent: any, args: any, toBlock: number | string, limit: number) {
        const step = 5300;
        return new Promise((resolve, reject) => {
            let results = [];
            const fetch = (to) => {
                let fromBlock = to - step;
                if (fromBlock < 0) {
                    fromBlock = 0;
                }
                const event = ethEvent(args, { fromBlock, toBlock: to });
                event.get((err, data) => {
                    if (err) {
                        return reject(err);
                    }
                    results = results.concat(data);
                    if (results.length < limit && fromBlock > 0) {
                        return fetch(fromBlock);
                    }
                    return resolve({ results, fromBlock });
                });
            };
            fetch(toBlock);
        });

    }

}

export default new Contracts();
