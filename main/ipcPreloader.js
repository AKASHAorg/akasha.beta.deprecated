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
        this.CHUNK_SIZE = 64 * 1024;
        this.MAX_RECURSION = 5;
        this.manager = manager;
    }
    send(data, hasMedia = false) {
        if (!hasMedia) {
            return electron_1.ipcRenderer.send(this.channel, data);
        }
        this.idRequest++;
        this._sendInChunks(data, this.idRequest, 1);
    }
    _sendInChunks(data, idRequest, recursionLevel) {
        if (recursionLevel > this.MAX_RECURSION) {
            return;
        }
        Object.keys(data).forEach((element) => {
            if (data[element] instanceof Uint8Array) {
                this._push(data[element], element, recursionLevel, idRequest);
            }
            else if (typeof data[element] === 'object') {
                this._sendInChunks(data[element], idRequest, recursionLevel++);
            }
        });
    }
    _push(uint8Instance, key, recursionLevel, idRequest) {
        const chunks = Math.ceil(uint8Instance.length / this.CHUNK_SIZE);
        for (let i = 0; i < chunks; i++) {
            const start = i * this.CHUNK_SIZE;
            const slice = start + this.CHUNK_SIZE;
            const stop = (slice > uint8Instance.length) ? uint8Instance.length : slice;
            electron_1.ipcRenderer.send(this.channel, {
                key,
                value: uint8Instance.subarray(start, stop),
                slices: chunks,
                currentSlice: i,
                recursionLevel,
                idRequest
            });
        }
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