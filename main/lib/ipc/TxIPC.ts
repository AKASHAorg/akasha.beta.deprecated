import { gethHelper, CONSTANTS, GethConnector } from '@akashaproject/geth-connector';
import ModuleEmitter from './event/ModuleEmitter';
import channels from '../channels';
import { mainResponse } from './event/responses';
import WebContents = Electron.WebContents;

class TxIPC extends ModuleEmitter {
    constructor() {
        super();
        this.MODULE_NAME = 'tx';
        this.DEFAULT_MANAGED = ['addToQueue', 'emitMined'];
        this.attachEmitters();
    }

    public initListeners(webContents: WebContents) {
        this.webContents = webContents;
        this._addToQueue()
            ._listenMined()
            ._manager();
    }

    public attachEmitters() {
        this._emitMined();
        return true;
    }

    private _addToQueue() {
        this.registerListener(
            channels.server[this.MODULE_NAME].addToQueue,
            (event: any, data: AddToQueueRequest[]) => {
                data.forEach((hash) => {
                    gethHelper.addTxToWatch(hash.tx, false);
                });
                gethHelper.startTxWatch();
                const response: AddToQueueResponse = mainResponse({ watching: gethHelper.watching });
                this.fireEvent(
                    channels.client[this.MODULE_NAME].addToQueue,
                    response,
                    event
                );
            });
        return this;
    }

    private _listenMined() {
        this.registerListener(
            channels.server[this.MODULE_NAME].emitMined,
            (event: any, data: EmitMinedRequest) => {
                (data.watch) ? gethHelper.startTxWatch() : gethHelper.stopTxWatch();
                const response: EmitMinedResponse = mainResponse({ watching: gethHelper.watching });
                this.fireEvent(
                    channels.client[this.MODULE_NAME].emitMined,
                    response,
                    event
                );
            });
        return this;
    }

    private _emitMined() {
        GethConnector.getInstance().on(
            CONSTANTS.TX_MINED,
            (txHash: string) => {
                const response: EmitMinedResponse = mainResponse({ mined: txHash, watching: gethHelper.watching });
                this.fireEvent(
                    channels.client[this.MODULE_NAME].emitMined,
                    response
                );
            }
        );
    }
}

export default TxIPC;
