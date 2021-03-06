import WebContents = Electron.WebContents;
import { AbstractListener } from './AbstractListener';

interface AbstractEmitterInterface {
    webContents: WebContents;

    /**
     * Generic method to dispatch a channel event
     * @param channel
     * @param data
     * @param event
     */
    fireEvent(channel: string, data: MainResponse, event?: any): void;

    attachEmitters(): any;
}

export abstract class AbstractEmitter extends AbstractListener implements AbstractEmitterInterface {
    public webContents: WebContents;

    /**
     * Generic method to dispatch a channel event
     * @param channel
     * @param data
     * @param event
     */
    public fireEvent(channel: string, data: MainResponse, event?: any) {
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
