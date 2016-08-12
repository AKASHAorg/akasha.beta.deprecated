/// <reference path="../../typings/main.d.ts" />
import { GethConnector, gethHelper } from '@akashaproject/geth-connector';
import GethEmitter from './event/GethEmitter';
import channels from '../channels';
import Logger from './Logger';
import { gethResponse } from './event/responses';
import IpcMainEvent = Electron.IpcMainEvent;
import IpcRenderer = Electron.IpcRenderer;
import IpcRendererEvent = Electron.IpcRendererEvent;
import WebContents = Electron.WebContents;

class GethIPC extends GethEmitter {
    public logger = 'geth';
    private DEFAULT_MANAGED: string[] = ['startService', 'stopService'];

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
            ._syncStatus()
            ._logs()
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
                            gethResponse({}, { message: `already listening on ${data.channel}` }),
                            event
                        );
                    }
                    // start listening for events on channel
                    this.listenEvents(data.channel);
                    // emit ok response
                    return this.fireEvent(channels.client.geth.manager, gethResponse(data), event);
                }
                // remove listener on `channel`
                return this.purgeListener(data.channel);
            }
        );
        // start listening immediately on `manager` channel
        this.listenEvents(channels.server.geth.manager);
        this.DEFAULT_MANAGED.forEach(
            (action: string) =>
                this.listenEvents(channels.server.geth[action])
        );
    }

    /**
     *
     * @returns {GethIPC}
     * @private
     */
    private _start() {
        this.registerListener(
            channels.server.geth.startService,
            (event: IpcMainEvent, data: GethStartRequest) => {
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
            (event: IpcMainEvent, data: GethRestartRequest) => {
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
            (event: IpcMainEvent, data: GethStopRequest) => {
                GethConnector.getInstance().stop(data.signal);
            }
        );
        return this;
    }

    /**
     *
     * @returns {GethIPC}
     * @private
     */
    private _syncStatus() {
        this.registerListener(
            channels.server.geth.syncStatus,
            (event: any) => {
                return gethHelper
                    .inSync()
                    .then((state: any[]) => {
                            let response: GethSyncStatus;
                            let knownStates: number;
                            let pulledStates: number;
                            if (!state.length) {
                                response = { synced: true };
                            } else {
                                response = { synced: false, peerCount: state[0] };
                                if (state.length === 2) {
                                    knownStates = GethConnector.getInstance()
                                        .web3.toDecimal(state[1].knownStates);
                                    pulledStates = GethConnector.getInstance()
                                        .web3.toDecimal(state[1].pulledStates);
                                    Object.assign(response, state[1], { knownStates, pulledStates });
                                }
                            }
                            this.fireEvent(
                                channels.client.geth.syncStatus,
                                gethResponse(response),
                                event
                            );
                        }
                    )
                    .catch(err => {
                        this.fireEvent(
                            channels.client.geth.syncStatus,
                            gethResponse({}, { message: err.message }),
                            event
                        );
                    });
            }
        );
        return this;
    }

    /**
     *
     * @returns {GethIPC}
     * @private
     */
    private _logs() {
        this.registerListener(
            channels.server.geth.logs,
            (event: any) => {
                GethConnector.getInstance().logger.query(
                    { start: -20, limit: 20 },
                    (err: Error, info: any) => {
                        let response: MainResponse;
                        if (err) {
                            response = gethResponse({}, { message: err.message });
                        } else {
                            response = gethResponse(info);
                        }
                        this.fireEvent(
                            channels.client.geth.logs,
                            response,
                            event
                        );
                    }
                );
            });
        return this;
    }
}
export default GethIPC;
