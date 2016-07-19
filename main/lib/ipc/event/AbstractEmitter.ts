import IpcRendererEvent = Electron.IpcRendererEvent;
import WebContents = Electron.WebContents;

export abstract class AbstractEmitter {
    webContents: WebContents;
    fireEvent(channel: string, data: Object, event?: IpcRendererEvent) {
        if (event) {
            return event.sender.send(channel, data);
        }
        return this.webContents.send(channel, data);
    }
}
