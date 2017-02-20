/// <reference types="electron" />
import ModuleEmitter from './event/ModuleEmitter';
import WebContents = Electron.WebContents;
declare class ChatIPC extends ModuleEmitter {
    constructor();
    initListeners(webContents: WebContents): void;
}
export default ChatIPC;
