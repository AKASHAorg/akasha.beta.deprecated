/// <reference path="../../typings/main.d.ts" />
/// <reference types="electron" />
import GethEmitter from './event/GethEmitter';
import WebContents = Electron.WebContents;
declare class GethIPC extends GethEmitter {
    logger: string;
    private BOOTNODE;
    private DEFAULT_MANAGED;
    constructor();
    initListeners(webContents: WebContents): void;
    private _manager();
    private _start();
    private _restart();
    private _stop();
    private _syncStatus();
    private _logs();
    private _status();
    private _options();
}
export default GethIPC;
