import { ipcMain, BrowserWindow } from 'electron';
import { ApiListener, listenerType } from '@akashaproject/core/ipcPreloader';

export default class IpcChannelMain extends ApiListener {
  protected windowId;

  get listenerCount() {
    return ipcMain.listenerCount(this.channel);
  }

  public on(listener: listenerType) {
    ipcMain.on(this.channel, listener);
  }

  public once(listener: listenerType) {
    ipcMain.once(this.channel, listener);
  }

  public removeListener(listener: listenerType) {
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
