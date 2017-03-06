"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ModuleEmitter_1 = require("./event/ModuleEmitter");
const index_1 = require("./modules/utils/index");
class UtilsIPC extends ModuleEmitter_1.default {
    constructor() {
        super();
        this.MODULE_NAME = 'utils';
        this.DEFAULT_MANAGED = [];
    }
    initListeners(webContents) {
        this.webContents = webContents;
        this._initMethods(index_1.default);
        this._manager();
    }
}
exports.default = UtilsIPC;
//# sourceMappingURL=UtilsIPC.js.map