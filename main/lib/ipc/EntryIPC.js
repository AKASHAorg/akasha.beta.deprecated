"use strict";
const ModuleEmitter_1 = require("./event/ModuleEmitter");
const index_1 = require("./modules/entry/index");
class EntryIPC extends ModuleEmitter_1.default {
    constructor() {
        super();
        this.MODULE_NAME = 'entry';
        this.DEFAULT_MANAGED = ['getScore', 'getEntry'];
    }
    initListeners(webContents) {
        this.webContents = webContents;
        this._initMethods(index_1.default);
        this._manager();
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EntryIPC;
//# sourceMappingURL=EntryIPC.js.map