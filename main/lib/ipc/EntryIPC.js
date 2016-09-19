"use strict";
const ModuleEmitter_1 = require('./event/ModuleEmitter');
const channels_1 = require('../channels');
class EntryIPC extends ModuleEmitter_1.default {
    constructor() {
        super();
        this.MODULE_NAME = 'entry';
        this.DEFAULT_MANAGED = ['getVoteEndDate', 'getScore'];
    }
    initListeners(webContents) {
        this.webContents = webContents;
        this
            ._manager();
    }
    _publish() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].create, (event, data) => {
        });
        return this;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EntryIPC;
//# sourceMappingURL=EntryIPC.js.map