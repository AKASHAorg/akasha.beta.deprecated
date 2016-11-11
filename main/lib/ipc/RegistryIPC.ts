/// <reference path="../../typings/main.d.ts" />
import ModuleEmitter from './event/ModuleEmitter';
import registry from './modules/registry/index';
import WebContents = Electron.WebContents;

class RegistryIPC extends ModuleEmitter {

    constructor() {
        super();
        this.MODULE_NAME = 'registry';
        this.DEFAULT_MANAGED = ['getCurrentProfile', 'getByAddress'];
    }

    public initListeners(webContents: WebContents) {
        this.webContents = webContents;
        this._initMethods(registry);
        this._manager();
    }
}

export default RegistryIPC;
