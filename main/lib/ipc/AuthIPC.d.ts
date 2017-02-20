/// <reference path="../../typings/main.d.ts" />
/// <reference types="electron" />
import ModuleEmitter from './event/ModuleEmitter';
import WebContents = Electron.WebContents;
declare class AuthIPC extends ModuleEmitter {
    constructor();
    initListeners(webContents: WebContents): void;
    private _login();
    private _logout();
    private _generateEthKey();
    private _getLocalIdentities();
    private _requestEther();
}
export default AuthIPC;
