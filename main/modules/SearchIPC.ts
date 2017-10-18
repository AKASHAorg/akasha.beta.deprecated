/// <reference path="../typings/main.d.ts" />
import ModuleEmitter from '../event/ModuleEmitter';
import search from './search/index';
import WebContents = Electron.WebContents;

class SearchIPC extends ModuleEmitter {

    constructor() {
        super();
        this.MODULE_NAME = 'search';
        this.DEFAULT_MANAGED = ['query', 'syncTags', 'findTags'];
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
