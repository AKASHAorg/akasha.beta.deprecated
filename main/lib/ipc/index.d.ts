/// <reference types="electron" />
import WebContents = Electron.WebContents;
export declare function initModules(): {
    initListeners: (webContents: WebContents) => void;
    logger: any;
    flushAll: () => void;
};
