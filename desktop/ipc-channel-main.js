"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const ipcPreloader_1 = require("@akashaproject/core/ipcPreloader");
class IpcChannelMain extends ipcPreloader_1.ApiListener {
    constructor(channel, opts) {
        super(channel, opts.channelName);
        this.windowId = opts.windowId;
    }
    get listenerCount() {
        return electron_1.ipcMain.listenerCount(this.channel);
    }
    on(listener) {
        electron_1.ipcMain.on(this.channel, listener);
    }
    once(listener) {
        electron_1.ipcMain.once(this.channel, listener);
    }
    removeListener(listener) {
        electron_1.ipcMain.removeListener(this.channel, listener);
    }
    removeAllListeners() {
        electron_1.ipcMain.removeAllListeners(this.channel);
    }
    send(data) {
        if (!this.windowId) {
            console.error(`windowId is not set on ${this.channelName}`);
            return;
        }
        return electron_1.BrowserWindow
            .fromId(this.windowId)
            .webContents
            .send(this.channel, data);
    }
}
exports.default = IpcChannelMain;
//# sourceMappingURL=ipc-channel-main.js.map