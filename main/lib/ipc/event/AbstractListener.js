"use strict";
const electron_1 = require('electron');
class AbstractListener {
    listenEvents(channel) {
        if (this.listeners.get(channel)) {
            throw new Error(`Must register a listener for ${channel}`);
        }
        return electron_1.ipcMain.on(channel, this.listeners.get(channel));
    }
    registerListener(channel, cb) {
        this.listeners.set(channel, cb);
    }
    purgeListener(channel) {
        if (!this.listeners.get(channel)) {
            return false;
        }
        this.stopListener(channel);
        return this.listeners.delete(channel);
    }
    purgeAllListeners() {
        this.listeners.forEach((cb, channel) => {
            return electron_1.ipcMain.removeListener(channel, cb);
        });
        this.listeners.clear();
    }
    stopListener(channel) {
        return electron_1.ipcMain.removeListener(channel, this.listeners.get(channel));
    }
}
exports.AbstractListener = AbstractListener;
//# sourceMappingURL=AbstractListener.js.map