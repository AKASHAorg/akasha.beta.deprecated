import { ipcRenderer } from 'electron';
import { ApiListener } from '@akashaproject/core/ipcPreloader';

export default class IpcChannelRenderer extends ApiListener {
  constructor(channel: string, channelName?: string) {
    super(channel, channelName);
  }
  get listenerCount() {
    return ipcRenderer.listenerCount(this.channel);
  }

  public on(listener: Function) {
    ipcRenderer.on(this.channel, listener);
  }

  public once(listener: Function) {
    ipcRenderer.once(this.channel, listener);
  }

  public removeListener(listener: Function) {
    ipcRenderer.removeListener(this.channel, listener);
  }

  public removeAllListeners() {
    ipcRenderer.removeAllListeners(this.channel);
  }

  public send(data: {}) {
    return ipcRenderer.send(this.channel, data);
  }
}
