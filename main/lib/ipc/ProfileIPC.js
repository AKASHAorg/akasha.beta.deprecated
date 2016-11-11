"use strict";
const ModuleEmitter_1 = require('./event/ModuleEmitter');
const index_1 = require('./modules/profile/index');
class ProfileIPC extends ModuleEmitter_1.default {
    constructor() {
        super();
        this.MODULE_NAME = 'profile';
        this.DEFAULT_MANAGED = ['getProfileData', 'getBalance'];
    }
    initListeners(webContents) {
        this.webContents = webContents;
        this._initMethods(index_1.default);
        this._manager();
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProfileIPC;
//# sourceMappingURL=ProfileIPC.js.map