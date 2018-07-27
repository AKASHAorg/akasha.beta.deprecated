import { ipcRenderer } from 'electron';
import { ApiListener, ApiRequest } from '@akashaproject/core/ipcPreloader';


export class IpcApiListener extends ApiListener {

  get listenerCount() {
    return ipcRenderer.listenerCount(this.channel);
  }

  public on(listener: any) {
    ipcRenderer.on(this.channel, listener);
  }

  public once(listener: any) {
    ipcRenderer.once(this.channel, listener);
  }

  public removeListener(listener: any) {
    ipcRenderer.removeListener(this.channel, listener);
  }

  public removeAllListeners() {
    ipcRenderer.removeAllListeners(this.channel);
  }
}

export class IpcApiRequest extends IpcApiListener, ApiRequest {
  public manager: string;

  constructor(channel: string, manager: string, channelName?: string) {
    super(channel, channelName);
    this.manager = manager;
  }

  public send(data: {}) {
    return ipcRenderer.send(this.channel, data);
  }

  public enable() {
    ipcRenderer.send(this.manager, { channel: this.channel, listen: true });
  }

  public disable() {
    ipcRenderer.send(this.manager, { channel: this.channel, listen: false });
  }
}
