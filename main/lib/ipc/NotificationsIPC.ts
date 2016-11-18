import notifications from './modules/notifications/index';
import ModuleEmitter from './event/ModuleEmitter';
import WebContents = Electron.WebContents;

class NotificationsIPC extends ModuleEmitter {

    constructor() {
        super();
        this.MODULE_NAME = 'notifications';
        this.DEFAULT_MANAGED = ['feed', 'setFilter'];
    }

    public initListeners(webContents: WebContents) {
        this.webContents = webContents;
        this._initMethods(notifications);
        this._manager();
    }

}

export default NotificationsIPC;

