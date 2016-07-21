/// <reference path="../../typings/main.d.ts" />
import { GethConnector, CONSTANTS } from '@akashaproject/geth-connector';
import GethEmitter from './event/GethEmitter';
import channels from '../channels';
import Logger from './Logger';
import IpcMainEvent = Electron.IpcMainEvent;
import IpcRenderer = Electron.IpcRenderer;
import IpcRendererEvent = Electron.IpcRendererEvent;

class GethIPC extends GethEmitter {
    public logger = 'gethLog';

    constructor() {
        super();
        GethConnector.getInstance().setLogger(
            Logger.getInstance().registerLogger(this.logger)
        );
        this.attachEmitters();
        this.registerListener(
            channels.server.geth.manager,
            (event: any, data: IPCmanager) => {
                if (data.listen) {
                    this.listenEvents(data.channel);
                    this.fireEvent(channels.client.geth.manager, {data: data}, event );
                }
                this.purgeListener(data.channel);
            }
        );
        this.listenEvents(channels.server.geth.manager);
    }

    initListeners() {
        // register listeners
        this._start()
            ._restart()
            ._stop();
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
