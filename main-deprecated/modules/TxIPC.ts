import { CONSTANTS, GethConnector, gethHelper } from '@akashaproject/geth-connector';
import ModuleEmitter from '../event/ModuleEmitter';
import channels from '../channels';
import { mainResponse } from '../event/responses';
import txModule from './tx';
import WebContents = Electron.WebContents;

class TxIPC extends ModuleEmitter {
    constructor() {
        super();
        this.MODULE_NAME = 'tx';
        this.DEFAULT_MANAGED = ['addToQueue', 'emitMined', 'getTransaction'];
        this.attachEmitters();
    }

    public initListeners(webContents: WebContents) {
        this.webContents = webContents;
        this._initMethods(txModule);
        this._manager();
    }

    public attachEmitters() {
        this._emitMined();
        return true;
    }

    private _emitMined() {
        GethConnector.getInstance().on(
            CONSTANTS.TX_MINED,
            (tx: any) => {
                const response: EmitMinedResponse = mainResponse({
                    mined: tx.transactionHash,
                    blockNumber: tx.blockNumber,
                    cumulativeGasUsed: tx.cumulativeGasUsed,
                    hasEvents: !!(tx.logs.length),
                    watching: gethHelper.watching
                }, {});
                this.fireEvent(
                    channels.client[this.MODULE_NAME].emitMined,
                    response
                );
            }
        );
    }
}

export default TxIPC;
