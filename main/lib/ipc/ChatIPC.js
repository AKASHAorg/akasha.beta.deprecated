"use strict";
const ModuleEmitter_1 = require("./event/ModuleEmitter");
const index_1 = require("./modules/chat/index");
class ChatIPC extends ModuleEmitter_1.default {
    constructor() {
        super();
        this.MODULE_NAME = 'chat';
        this.DEFAULT_MANAGED = ['fetch', 'post', 'join', 'leave', 'getCurrentChannels'];
    }
    initListeners(webContents) {
        this.webContents = webContents;
        this._initMethods(index_1.default);
        this._manager();
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChatIPC;
//# sourceMappingURL=ChatIPC.js.map