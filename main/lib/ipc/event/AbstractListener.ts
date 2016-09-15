import { ipcMain } from 'electron';
import IpcMainEventListener = Electron.IpcMainEventListener;
import WebContents = Electron.WebContents;

export abstract class AbstractListener {
    public listeners: Map<string, IpcMainEventListener> = new Map();

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
    public registerListener(channel: string, cb: IpcMainEventListener): void {
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
        return this.listeners.delete(channel);
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
