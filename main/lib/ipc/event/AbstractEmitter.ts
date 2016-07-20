import IpcRendererEvent = Electron.IpcRendererEvent;
import WebContents = Electron.WebContents;
import { BrowserWindow } from 'electron';
import { AbstractListener } from './AbstractListener';

export abstract class AbstractEmitter extends AbstractListener {
    public webContents: WebContents;

    constructor() {
        super();
        // there is only one window for entire app
        this.webContents = BrowserWindow.getFocusedWindow().webContents;
        this.initListeners();
    }

    /**
     * Generic method to dispatch a channel event
     * @param channel
     * @param data
     * @param event
     */
    fireEvent(channel: string, data: Object, event?: IpcRendererEvent) {
        if (event) {
            return event.sender.send(channel, data);
        }
        return this.webContents.send(channel, data);
    }

    abstract attachEmitters(): any;
}
