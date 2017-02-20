/// <reference types="electron" />
import ModuleEmitter from './event/ModuleEmitter';
import WebContents = Electron.WebContents;
declare class CommentsIPC extends ModuleEmitter {
    constructor();
    initListeners(webContents: WebContents): void;
}
export default CommentsIPC;
