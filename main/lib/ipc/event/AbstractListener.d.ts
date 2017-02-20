/// <reference types="electron" />
import IpcMainEventListener = Electron.IpcMainEventListener;
import WebContents = Electron.WebContents;
export declare abstract class AbstractListener {
    listeners: Map<string, IpcMainEventListener>;
    listenEvents(channel: string): Electron.IpcMain;
    registerListener(channel: string, cb: IpcMainEventListener): void;
    purgeListener(channel: string): boolean;
    purgeAllListeners(): void;
    stopListener(channel: string): Electron.IpcMain;
    getListenersCount(channel: string): number;
    abstract initListeners(webContents: WebContents): any;
}
