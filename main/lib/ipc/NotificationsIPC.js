"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./modules/notifications/index");
const ModuleEmitter_1 = require("./event/ModuleEmitter");
class NotificationsIPC extends ModuleEmitter_1.default {
    constructor() {
        super();
        this.MODULE_NAME = 'notifications';
        this.DEFAULT_MANAGED = ['feed', 'setFilter', 'excludeFilter', 'includeFilter'];
    }
    initListeners(webContents) {
        this.webContents = webContents;
        this._initMethods(index_1.default);
        this._manager();
    }
}
exports.default = NotificationsIPC;
//# sourceMappingURL=NotificationsIPC.js.map