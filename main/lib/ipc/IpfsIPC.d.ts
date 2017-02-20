/// <reference path="../../typings/main.d.ts" />
/// <reference types="electron" />
import IpfsEmitter from './event/IpfsEmitter';
import WebContents = Electron.WebContents;
declare class IpfsIPC extends IpfsEmitter {
    logger: string;
    private DEFAULT_MANAGED;
    constructor();
    initListeners(webContents: WebContents): void;
    private _start();
    private _stop();
    private _manager();
    private _status();
    private _resolve();
    private _getConfig();
    private _setPorts();
    private _getPorts();
    private _logs();
}
export default IpfsIPC;
