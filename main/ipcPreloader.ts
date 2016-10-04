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

    constructor(channel: string, manager: string, channelName?: string) {
        super(channel, channelName);
        this.manager = manager;
    }

    public send(data) {
        ipcRenderer.send(this.channel, data);
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
