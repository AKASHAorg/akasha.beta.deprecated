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
        const tx = await auth.signData(data, token);
        cb(null, { tx });
        return Contracts.watchTx(tx);
    }

    public static watchTx(tx: string) {
        const timeout = 300000;
        const start = new Date().getTime();
        return new Promise((resolve, reject) => {
            const getReceipt = function () {
                GethConnector.getInstance().web3
                    .eth.getTransactionReceipt((err, receipt) => {
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

}

export default new Contracts();
