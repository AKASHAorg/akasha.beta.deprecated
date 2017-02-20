/// <reference types="electron" />
import ModuleEmitter from './event/ModuleEmitter';
import WebContents = Electron.WebContents;
declare class LicensesIPC extends ModuleEmitter {
    constructor();
    initListeners(webContents: WebContents): void;
    private _getLicenses();
    private _getLicenceById();
}
export default LicensesIPC;
