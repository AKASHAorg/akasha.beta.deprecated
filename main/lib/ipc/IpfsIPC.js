"use strict";
const IpfsEmitter_1 = require('./event/IpfsEmitter');
const ipfs_connector_1 = require('@akashaproject/ipfs-connector');
const Logger_1 = require('./Logger');
class IpfsIPC extends IpfsEmitter_1.default {
    constructor() {
        super();
        this.logger = 'ipfs';
        this.DEFAULT_MANAGED = ['startService', 'stopService'];
        this.attachEmitters();
    }
    initListeners(webContents) {
        ipfs_connector_1.IpfsConnector.getInstance().setLogger(Logger_1.default.getInstance().registerLogger(this.logger));
        this.webContents = webContents;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = IpfsIPC;
//# sourceMappingURL=IpfsIPC.js.map