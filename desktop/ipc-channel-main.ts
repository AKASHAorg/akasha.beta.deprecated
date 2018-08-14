import { ipcMain, BrowserWindow } from 'electron';
import { ApiListener } from '@akashaproject/core/ipcPreloader';

export default class IpcChannelMain extends ApiListener {
  protected windowId;
  constructor(channel: string, opts: {channelName?: string, windowId?: string}) {
    super(channel, opts.channelName);
    this.windowId = opts.windowId;
  }

  get listenerCount() {
    return ipcMain.listenerCount(this.channel);
  }

  public on(listener: Function) {
    ipcMain.on(this.channel, listener);
  }

  public once(listener: Function) {
    ipcMain.once(this.channel, listener);
  }

  public removeListener(listener: Function) {
    ipcMain.removeListener(this.channel, listener);
  }

  public removeAllListeners() {
    ipcMain.removeAllListeners(this.channel);
  }

  public send(data: {}) {
    if (!this.windowId) {
      console.error(`windowId is not set on ${this.channelName}`);
      return;
    }
    return BrowserWindow
    .fromId(this.windowId)
    .webContents
    .send(this.channel, data);
  }
}
