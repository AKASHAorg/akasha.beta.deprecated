/// <reference path="../../typings/main.d.ts" />
/// <reference types="electron" />
import ModuleEmitter from './event/ModuleEmitter';
import WebContents = Electron.WebContents;
declare class UtilsIPC extends ModuleEmitter {
    constructor();
    initListeners(webContents: WebContents): void;
}
export default UtilsIPC;
