/// <reference path="../typings/main.d.ts" />
import ModuleEmitter from '../event/ModuleEmitter';
import tags from './tags/index';
import WebContents = Electron.WebContents;

class TagsIPC extends ModuleEmitter {

    constructor() {
        super();
        this.MODULE_NAME = 'tags';
        this.DEFAULT_MANAGED = ['exists', 'getTagId', 'getTagName', 'searchTag'];
    }

    /**
     *
     * @param webContents
     */
    public initListeners(webContents: WebContents) {
        this.webContents = webContents;
        this._initMethods(tags);
        this._manager();
    }
}

export default TagsIPC;
