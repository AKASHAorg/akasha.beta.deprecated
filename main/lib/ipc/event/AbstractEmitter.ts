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
    fireEvent(channel: string, data: MainResponse, event?: IpcRendererEvent) {
        if (event) {
            return event.sender.send(channel, data);
        }
        return this.webContents.send(channel, data);
    }

    abstract attachEmitters(): any;
}
