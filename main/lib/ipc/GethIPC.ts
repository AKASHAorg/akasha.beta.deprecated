/// <reference path="../../typings/main.d.ts" />
import { GethConnector } from '@akashaproject/geth-connector';
import GethEmitter from './event/GethEmitter';
import channels from '../channels';
import Logger from './Logger';
import IpcMainEvent = Electron.IpcMainEvent;
import IpcRenderer = Electron.IpcRenderer;
import IpcRendererEvent = Electron.IpcRendererEvent;
import WebContents = Electron.WebContents;

class GethIPC extends GethEmitter {
    public logger = 'gethLog';

    constructor() {
        super();
        this.attachEmitters();
    }

    initListeners(webContents: WebContents) {
        GethConnector.getInstance().setLogger(
            Logger.getInstance().registerLogger(this.logger)
        );
        this.webContents = webContents;
        // register listeners
        this._start()
            ._restart()
            ._stop()
            ._manager();
    }

    /**
     * Module ipc channel manager
     * @private
     */
    private _manager() {
        this.registerListener(
            channels.server.geth.manager,
            /**
             * @param event
             * @param data
             * @returns {any}
             */
            (event: any, data: IPCmanager) => {
                // listen on new channel
                if (data.listen) {
                    // check if already listening on channel
                    if (this.getListenersCount(data.channel) > 1) {
                        // emit error
                        return this.fireEvent(
                            channels.client.geth.manager,
                            {
                                data: {},
                                error: { message: `already listening on ${data.channel}` }
                            },
                            event
                        );
                    }
                    // start listening for events on channel
                    this.listenEvents(data.channel);
                    // emit ok response
                    return this.fireEvent(channels.client.geth.manager, { data: data }, event);
                }
                // remove listener on `channel`
                return this.purgeListener(data.channel);
            }
        );
        // start listening immediately on `manager` channel
        this.listenEvents(channels.server.geth.manager);
    }

    /**
     *
     * @returns {GethIPC}
     * @private
     */
    private _start() {
        this.registerListener(
            channels.server.geth.startService,
            (event: IpcMainEvent, data: GethStart) => {
                GethConnector.getInstance().start(data);
            }
        );
        return this;
    }

    /**
     *
     * @returns {GethIPC}
     * @private
     */
    private _restart() {
        this.registerListener(
            channels.server.geth.restartService,
            (event: IpcMainEvent, data: GethRestart) => {
                GethConnector.getInstance().restart(data.timer);
            }
        );
        return this;
    }

    /**
     *
     * @returns {GethIPC}
     * @private
     */
    private _stop() {
        this.registerListener(
            channels.server.geth.stopService,
            (event: IpcMainEvent, data: GethStop) => {
                GethConnector.getInstance().stop(data.signal);
            }
        );
        return this;
    }

}
export default GethIPC;
