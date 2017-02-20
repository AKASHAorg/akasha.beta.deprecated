/// <reference types="electron" />
import ModuleEmitter from './event/ModuleEmitter';
import WebContents = Electron.WebContents;
declare class TxIPC extends ModuleEmitter {
    constructor();
    initListeners(webContents: WebContents): void;
    attachEmitters(): boolean;
    private _addToQueue();
    private _listenMined();
    private _emitMined();
}
export default TxIPC;
