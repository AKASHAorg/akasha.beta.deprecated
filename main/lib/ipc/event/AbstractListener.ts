import { ipcMain } from 'electron';
import IpcMainEventListener = Electron.IpcMainEventListener;

export abstract class AbstractListener {
    public listeners: Map<string, IpcMainEventListener>;

    /**
     * Start listening for a registered channel
     * @param channel
     * @returns {Electron.IpcMain}
     */
    listenEvents(channel: string) {
        if (this.listeners.get(channel)) {
            throw new Error(`Must register a listener for ${channel}`);
        }
        return ipcMain.on(channel, this.listeners.get(channel));
    }

    /**
     * Register a channel event handler
     * @param channel
     * @param cb
     */
    registerListener(channel: string, cb: IpcMainEventListener): void {
        this.listeners.set(channel, cb);
    }

    /**
     *
     * @param channel
     * @returns {boolean}
     */
    purgeListener(channel: string) {
        if (!this.listeners.get(channel)) {
            return false;
        }
        this.stopListener(channel);
        return this.listeners.delete(channel);
    }

    /**
     *
     */
    purgeAllListeners() {
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
    stopListener(channel: string) {
        return ipcMain.removeListener(channel, this.listeners.get(channel));
    }

    abstract initListeners(): any;
}
