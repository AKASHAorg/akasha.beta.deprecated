/// <reference path="../../typings/main.d.ts" />
import ModuleEmitter from './event/ModuleEmitter';
import search from './modules/search/index';
import WebContents = Electron.WebContents;

class SearchIPC extends ModuleEmitter {

    constructor() {
        super();
        this.MODULE_NAME = 'search';
        this.DEFAULT_MANAGED = ['handshake', 'query'];
    }

    /**
     *
     * @param webContents
     */
    public initListeners(webContents: WebContents) {
        this.webContents = webContents;
        this._initMethods(search);
        this._manager();
    }
}

export default SearchIPC;
