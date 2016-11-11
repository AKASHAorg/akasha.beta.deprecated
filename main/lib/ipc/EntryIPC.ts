import ModuleEmitter from './event/ModuleEmitter';
import entry from './modules/entry/index';
import WebContents = Electron.WebContents;

class EntryIPC extends ModuleEmitter {

    constructor() {
        super();
        this.MODULE_NAME = 'entry';
        this.DEFAULT_MANAGED = ['getScore', 'getEntry'];
    }

    public initListeners(webContents: WebContents) {
        this.webContents = webContents;
        this._initMethods(entry);
        this._manager();
    }

}

export default EntryIPC;
