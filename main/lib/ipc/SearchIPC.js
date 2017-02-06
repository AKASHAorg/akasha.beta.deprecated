"use strict";
const ModuleEmitter_1 = require('./event/ModuleEmitter');
const index_1 = require('./modules/search/index');
class SearchIPC extends ModuleEmitter_1.default {
    constructor() {
        super();
        this.MODULE_NAME = 'search';
        this.DEFAULT_MANAGED = ['handshake', 'query'];
    }
    initListeners(webContents) {
        this.webContents = webContents;
        this._initMethods(index_1.default);
        this._manager();
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SearchIPC;
//# sourceMappingURL=SearchIPC.js.map