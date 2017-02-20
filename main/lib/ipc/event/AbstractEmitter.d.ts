/// <reference types="electron" />
import IpcRendererEvent = Electron.IpcRendererEvent;
import WebContents = Electron.WebContents;
import { AbstractListener } from './AbstractListener';
export declare abstract class AbstractEmitter extends AbstractListener {
    webContents: WebContents;
    fireEvent(channel: string, data: MainResponse, event?: IpcRendererEvent): void;
    abstract attachEmitters(): any;
}
