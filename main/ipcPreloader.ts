import { ipcRenderer } from 'electron';
import IpcRendererEventListener = Electron.IpcRendererEventListener;

class GenericApi {
    public channel: string;
    public channelName: string;

    constructor(channel: string, channelName?: string) {
        this.channel = channel;
        this.channelName = channelName;
    }

}
export class ApiRequest extends GenericApi {
    public manager: string;
    public idRequest = 0;
    public CHUNK_SIZE = 64 * 1024; // 32kb
    public MAX_RECURSION = 5;

    constructor(channel: string, manager: string, channelName?: string) {
        super(channel, channelName);
        this.manager = manager;
    }

    public send(data: {}, hasMedia = false) {
        if (!hasMedia) {
            return ipcRenderer.send(this.channel, data);
        }
        this.idRequest++;
        this._sendInChunks(data, this.idRequest, 1);
    }

    private _sendInChunks(data: any, idRequest, recursionLevel) {
        if (recursionLevel > this.MAX_RECURSION) {
            return;
        }
        Object.keys(data).forEach((element) => {
            if (data[element] instanceof Uint8Array) {
                this._push(data[element], element, recursionLevel, idRequest);
            } else if (typeof data[element] === 'object') {
                this._sendInChunks(data[element], idRequest, recursionLevel++);
            }
        });
    }

    public _push(uint8Instance: Uint8Array, key: string, recursionLevel: number, idRequest) {
        const chunks = Math.ceil(uint8Instance.length / this.CHUNK_SIZE);
        for (let i = 0; i < chunks; i++) {
            const start = i * this.CHUNK_SIZE;
            const slice = start + this.CHUNK_SIZE;
            const stop = (slice > uint8Instance.length) ? uint8Instance.length : slice;
            ipcRenderer.send(
                this.channel,
                {
                    key,
                    value: uint8Instance.subarray(start, stop),
                    slices: chunks,
                    currentSlice: i,
                    recursionLevel,
                    idRequest
                }
            )
        }
    }

    public enable() {
        ipcRenderer.send(this.manager, { channel: this.channel, listen: true })
    }

    public disable() {
        ipcRenderer.send(this.manager, { channel: this.channel, listen: false })
    }
}

export class ApiListener extends GenericApi {

    public on(listener: IpcRendererEventListener) {
        ipcRenderer.on(this.channel, listener);
    }

    public once(listener: IpcRendererEventListener) {
        ipcRenderer.once(this.channel, listener);
    }

    public removeListener(listener: IpcRendererEventListener) {
        ipcRenderer.removeListener(this.channel, listener);
    }

    public removeAllListeners() {
        ipcRenderer.removeAllListeners(this.channel);
    }

    get listenerCount() {
        return ipcRenderer.listenerCount(this.channel);
    }
}
