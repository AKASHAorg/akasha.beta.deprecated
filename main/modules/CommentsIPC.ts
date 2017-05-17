import ModuleEmitter from '../event/ModuleEmitter';
import comments from './comments/index';
import WebContents = Electron.WebContents;

class CommentsIPC extends ModuleEmitter {

    constructor() {
        super();
        this.MODULE_NAME = 'comments';
        this.DEFAULT_MANAGED = ['comment'];
    }

    public initListeners(webContents: WebContents) {
        this.webContents = webContents;
        this._initMethods(comments);
        this._manager();
    }
}

export default CommentsIPC;
