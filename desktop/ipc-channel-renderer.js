"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const ipcPreloader_1 = require("@akashaproject/core/ipcPreloader");
class IpcChannelRenderer extends ipcPreloader_1.ApiListener {
    constructor(channel, channelName) {
        super(channel, channelName);
    }
    get listenerCount() {
        return electron_1.ipcRenderer.listenerCount(this.channel);
    }
    on(listener) {
        electron_1.ipcRenderer.on(this.channel, listener);
    }
    once(listener) {
        electron_1.ipcRenderer.once(this.channel, listener);
    }
    removeListener(listener) {
        electron_1.ipcRenderer.removeListener(this.channel, listener);
    }
    removeAllListeners() {
        electron_1.ipcRenderer.removeAllListeners(this.channel);
    }
    send(data) {
        return electron_1.ipcRenderer.send(this.channel, data);
    }
}
exports.default = IpcChannelRenderer;
//# sourceMappingURL=ipc-channel-renderer.js.map