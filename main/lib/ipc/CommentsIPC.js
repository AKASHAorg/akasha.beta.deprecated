"use strict";
const ModuleEmitter_1 = require('./event/ModuleEmitter');
const index_1 = require('./modules/comments/index');
class CommentsIPC extends ModuleEmitter_1.default {
    constructor() {
        super();
        this.MODULE_NAME = 'comments';
        this.DEFAULT_MANAGED = ['comment'];
    }
    initListeners(webContents) {
        this.webContents = webContents;
        this._initMethods(index_1.default);
        this._manager();
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CommentsIPC;
//# sourceMappingURL=CommentsIPC.js.map