"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const geth_connector_1 = require("@akashaproject/geth-connector");
const ModuleEmitter_1 = require("./event/ModuleEmitter");
const channels_1 = require("../channels");
const responses_1 = require("./event/responses");
class TxIPC extends ModuleEmitter_1.default {
    constructor() {
        super();
        this.MODULE_NAME = 'tx';
        this.DEFAULT_MANAGED = ['addToQueue', 'emitMined'];
        this.attachEmitters();
    }
    initListeners(webContents) {
        this.webContents = webContents;
        this._addToQueue()
            ._listenMined()
            ._manager();
    }
    attachEmitters() {
        this._emitMined();
        return true;
    }
    _addToQueue() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].addToQueue, (event, data) => {
            data.forEach((hash) => {
                geth_connector_1.gethHelper.addTxToWatch(hash.tx, false);
            });
            geth_connector_1.gethHelper.startTxWatch();
            const response = responses_1.mainResponse({ watching: geth_connector_1.gethHelper.watching });
            this.fireEvent(channels_1.default.client[this.MODULE_NAME].addToQueue, response, event);
        });
        return this;
    }
    _listenMined() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].emitMined, (event, data) => {
            (data.watch) ? geth_connector_1.gethHelper.startTxWatch() : geth_connector_1.gethHelper.stopTxWatch();
            const response = responses_1.mainResponse({ watching: geth_connector_1.gethHelper.watching });
            this.fireEvent(channels_1.default.client[this.MODULE_NAME].emitMined, response, event);
        });
        return this;
    }
    _emitMined() {
        geth_connector_1.GethConnector.getInstance().on(geth_connector_1.CONSTANTS.TX_MINED, (tx) => {
            const response = responses_1.mainResponse({
                mined: tx.transactionHash,
                blockNumber: tx.blockNumber,
                cumulativeGasUsed: tx.cumulativeGasUsed,
                hasEvents: !!(tx.logs.length),
                watching: geth_connector_1.gethHelper.watching
            });
            this.fireEvent(channels_1.default.client[this.MODULE_NAME].emitMined, response);
        });
    }
}
exports.default = TxIPC;
//# sourceMappingURL=TxIPC.js.map