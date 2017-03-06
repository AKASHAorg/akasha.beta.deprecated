"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ModuleEmitter_1 = require("./event/ModuleEmitter");
const index_1 = require("./modules/registry/index");
class RegistryIPC extends ModuleEmitter_1.default {
    constructor() {
        super();
        this.MODULE_NAME = 'registry';
        this.DEFAULT_MANAGED = ['getCurrentProfile', 'getByAddress'];
    }
    initListeners(webContents) {
        this.webContents = webContents;
        this._initMethods(index_1.default);
        this._manager();
    }
}
exports.default = RegistryIPC;
//# sourceMappingURL=RegistryIPC.js.map