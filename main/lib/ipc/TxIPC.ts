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
    }

    initListeners(webContents: WebContents) {
        this.webContents = webContents;
        this._addToQueue()
            ._listenMined()
            ._manager();
    }

    attachEmitters() {
        this._emitMined();
        return true;
    }

    private _addToQueue() {
        this.registerListener(
            channels.server[this.MODULE_NAME].addToQueue,
            (event: any, data: AddToQueueRequest) => {
                gethHelper.addTxToWatch(data.tx);
                this.fireEvent(
                    channels.client[this.MODULE_NAME].addToQueue,
                    mainResponse({ watching: gethHelper.watching })
                );
            });
        return this;
    }

    private _listenMined() {
        this.registerListener(
            channels.server[this.MODULE_NAME].emitMined,
            (event: any, data: EmitMinedRequest) => {
                (data.watch) ? gethHelper.startTxWatch() : gethHelper.stopTxWatch();
                this.fireEvent(
                    channels.client[this.MODULE_NAME].emitMined,
                    mainResponse({ watching: gethHelper.watching })
                );
            });
        return this;
    }

    private _emitMined() {
        GethConnector.getInstance().on(
            CONSTANTS.TX_MINED,
            (txHash: string) => {
                this.fireEvent(
                    channels.client[this.MODULE_NAME].emitMined,
                    mainResponse({ mined: txHash, watching: gethHelper.watching })
                );
            }
        );
    }
}

export default TxIPC;
