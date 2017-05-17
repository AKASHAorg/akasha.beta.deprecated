import IpcRendererEvent = Electron.IpcRendererEvent;
import WebContents = Electron.WebContents;
import { AbstractListener } from './AbstractListener';

export abstract class AbstractEmitter extends AbstractListener {
    public webContents: WebContents;

    /**
     * Generic method to dispatch a channel event
     * @param channel
     * @param data
     * @param event
     */
    public fireEvent(channel: string, data: MainResponse, event?: IpcRendererEvent) {
        if (event) {
            return event.sender.send(channel, data);
        }
        if (!this.webContents) {
            return;
        }
        return this.webContents.send(channel, data);
    }

    public abstract attachEmitters(): any;
}
