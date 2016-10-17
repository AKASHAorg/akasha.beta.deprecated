"use strict";
const electron_1 = require('electron');
class GenericApi {
    constructor(channel, channelName) {
        this.channel = channel;
        this.channelName = channelName;
    }
}
class ApiRequest extends GenericApi {
    constructor(channel, manager, channelName) {
        super(channel, channelName);
        this.idRequest = 0;
        this.manager = manager;
    }
    send(data, hasUint8 = false) {
        if (!hasUint8) {
            return electron_1.ipcRenderer.send(this.channel, data);
        }
        const registeredData = Object.assign(data, { requestId: this.idRequest });
        this.idRequest++;
    }
    _sendChunks(data) {
    }
    enable() {
        electron_1.ipcRenderer.send(this.manager, { channel: this.channel, listen: true });
    }
    disable() {
        electron_1.ipcRenderer.send(this.manager, { channel: this.channel, listen: false });
    }
}
exports.ApiRequest = ApiRequest;
class ApiListener extends GenericApi {
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
    get listenerCount() {
        return electron_1.ipcRenderer.listenerCount(this.channel);
    }
}
exports.ApiListener = ApiListener;
//# sourceMappingURL=ipcPreloader.js.map