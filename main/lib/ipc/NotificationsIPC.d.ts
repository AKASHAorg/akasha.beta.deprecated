/// <reference types="electron" />
import ModuleEmitter from './event/ModuleEmitter';
import WebContents = Electron.WebContents;
declare class NotificationsIPC extends ModuleEmitter {
    constructor();
    initListeners(webContents: WebContents): void;
}
export default NotificationsIPC;
