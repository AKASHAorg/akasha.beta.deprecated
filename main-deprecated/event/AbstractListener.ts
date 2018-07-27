import { ipcMain } from 'electron';
import WebContents = Electron.WebContents;

export interface AbstractListenerInterface {
    listeners: Map<string, any>;

    /**
     * Start listening for a registered channel
     * @param channel
     * @returns {Electron.IpcMain}
     */
    listenEvents(channel: string): Electron.IpcMain;

    /**
     * Register a channel event handler
     * @param channel
     * @param cb
     */
    registerListener(channel: string, cb: any): void;

    /**
     *
     * @param channel
     * @returns {boolean}
     */
    purgeListener(channel: string): boolean;

    /**
     *
     */
    purgeAllListeners(): void;

    /**
     * stop listening on channel
     * @param channel
     * @returns {Electron.IpcMain}
     */
    stopListener(channel: string): Electron.IpcMain;

    /**
     *
     * @param channel
     * @returns {number}
     */
    getListenersCount(channel: string): number;

    initListeners(webContents: WebContents): any;
}

export abstract class AbstractListener implements AbstractListenerInterface {
    public listeners: Map<string, any> = new Map();

    /**
     * Start listening for a registered channel
     * @param channel
     * @returns {Electron.IpcMain}
     */
    public listenEvents(channel: string) {
        if (!this.listeners.get(channel)) {
            throw new Error(`Must register a listener for ${channel}`);
        }
        if (this.getListenersCount(channel) !== 0) {
            ipcMain.removeAllListeners(channel);
        }
        return ipcMain.on(channel, this.listeners.get(channel));
    }

    /**
     * Register a channel event handler
     * @param channel
     * @param cb
     */
    public registerListener(channel: string, cb: any): void {
        this.listeners.set(channel, cb);
    }

    /**
     *
     * @param channel
     * @returns {boolean}
     */
    public purgeListener(channel: string) {
        if (!this.listeners.get(channel)) {
            return false;
        }
        this.stopListener(channel);
        return true;
    }

    /**
     *
     */
    public purgeAllListeners() {
        this.listeners.forEach((cb, channel) => {
            return ipcMain.removeListener(channel, cb);
        });
        this.listeners.clear();
    }

    /**
     * stop listening on channel
     * @param channel
     * @returns {Electron.IpcMain}
     */
    public stopListener(channel: string) {
        return ipcMain.removeListener(channel, this.listeners.get(channel));
    }

    /**
     *
     * @param channel
     * @returns {number}
     */
    public getListenersCount(channel: string) {
        return ipcMain.listenerCount(channel);
    }

    public abstract initListeners(webContents: WebContents): any;
}
