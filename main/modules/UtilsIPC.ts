/// <reference path="../typings/main.d.ts" />
import ModuleEmitter from '../event/ModuleEmitter';
import utils from './utils/index';
import WebContents = Electron.WebContents;

class UtilsIPC extends ModuleEmitter {

    constructor() {
        super();
        this.MODULE_NAME = 'utils';
        this.DEFAULT_MANAGED = [];
    }

    /**
     *
     * @param webContents
     */
    public initListeners(webContents: WebContents) {
        this.webContents = webContents;
        this._initMethods(utils);
        this._manager();
    }
}

export default UtilsIPC;
