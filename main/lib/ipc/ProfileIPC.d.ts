/// <reference types="electron" />
import ModuleEmitter from './event/ModuleEmitter';
import WebContents = Electron.WebContents;
declare class ProfileIPC extends ModuleEmitter {
    constructor();
    initListeners(webContents: WebContents): void;
}
export default ProfileIPC;
