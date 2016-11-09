"use strict";
const ModuleEmitter_1 = require('./event/ModuleEmitter');
const index_1 = require('./modules/tags/index');
class TagsIPC extends ModuleEmitter_1.default {
    constructor() {
        super();
        this.MODULE_NAME = 'tags';
        this.DEFAULT_MANAGED = ['exists'];
    }
    initListeners(webContents) {
        this.webContents = webContents;
        this._initMethods(index_1.default);
        this._manager();
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TagsIPC;
//# sourceMappingURL=TagsIPC.js.map