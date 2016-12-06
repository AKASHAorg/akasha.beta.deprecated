/// <reference path="../../typings/main.d.ts" />
import { GethConnector, gethHelper } from '@akashaproject/geth-connector';
import GethEmitter from './event/GethEmitter';
import channels from '../channels';
import Logger from './Logger';
import { gethResponse } from './event/responses';
import { join } from 'path';
import { app } from 'electron';
import { getGenesisPath } from './config/genesis';
import IpcMainEvent = Electron.IpcMainEvent;
import WebContents = Electron.WebContents;

class GethIPC extends GethEmitter {
    public logger = 'geth';
    private BOOTNODE = 'enode://a7b111165e63cb608814f0ba55c0e7f779841473320ac6dbe6089d952241fb5a5a' +
        '9bcc9406215e366ab5438d6ab11129c3247ed8354dc6e00ed9ce9305493667@138.68.78.152:30301';
    private DEFAULT_MANAGED: string[] = ['startService', 'stopService', 'status'];

    constructor() {
        super();
        this.attachEmitters();
    }

    public initListeners(webContents: WebContents) {
        GethConnector.getInstance().setLogger(
            Logger.getInstance().registerLogger(this.logger)
        );
        GethConnector.getInstance().setBinPath(app.getPath('userData'));
        this.webContents = webContents;
        const datadir = GethConnector.getDefaultDatadir();
        GethConnector.getInstance().setOptions({
            bootnodes: this.BOOTNODE,
            datadir: join(datadir, 'akasha'),
            ipcpath: join(datadir, 'akasha', 'geth.ipc'),
            networkid: 512180
        });
        // register listeners
        this._start()
            ._restart()
            ._stop()
            ._syncStatus()
            ._logs()
            ._status()
            ._options()
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
                    if (this.getListenersCount(data.channel) >= 1) {
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
                console.log('=== start geth ====');
                    GethConnector.getInstance().writeGenesis(
                        getGenesisPath(),
                        (err: Error, stdout: any) => {
                            if (err) {
                                (Logger.getInstance().getLogger(this.logger)).error(err);
                            }
                            (Logger.getInstance().getLogger(this.logger)).info(stdout);
                            GethConnector.getInstance().start(data);
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
                const signal = (data) ? data.signal : 'SIGINT';
                GethConnector.getInstance().stop(signal);
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
                            if (!state.length) {
                                response = { synced: true };
                            } else {
                                response = { synced: false, peerCount: state[0] };
                                if (state.length === 2) {
                                    Object.assign(response, state[1]);
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
                    { start: 0, limit: 20, order: 'desc' },
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

    /**
     * geth service status
     * @private
     */
    private _status() {
        this.registerListener(
            channels.server.geth.status,
            (event: any) => {
                if (!GethConnector.getInstance().serviceStatus.api) {
                    this.fireEvent(
                        channels.client.geth.status,
                        gethResponse({}),
                        event
                    );
                    return null;
                }
                let response;
                GethConnector.getInstance()
                    .web3
                    .eth
                    .getBlockNumberAsync()
                    .then((blockNr) => {
                        response = gethResponse({ blockNr });
                    })
                    .catch((err) => {
                        response = gethResponse({}, { message: err.message })
                    })
                    .finally(() => {
                        this.fireEvent(
                            channels.client.geth.status,
                            response,
                            event
                        );
                    })
            }
        );
        return this;
    }

    /**
     * Get or set geth spawn options
     * @returns {GethIPC}
     * @private
     */
    private _options() {
        this.registerListener(
            channels.server.geth.options,
            (event: any, data: any) => {
                const options = GethConnector.getInstance().setOptions(data);
                let mapObj = Object.create(null);
                for (let [k, v] of options) {
                    mapObj[k] = v;
                }
                this.fireEvent(
                    channels.client.geth.options,
                    gethResponse(mapObj),
                    event
                );
            }
        );
        return this;
    }
}
export default GethIPC;
