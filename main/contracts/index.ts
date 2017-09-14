const initContracts = require('@akashaproject/contracts.js');
import { GethConnector } from '@akashaproject/geth-connector';

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
}

export default new Contracts();
