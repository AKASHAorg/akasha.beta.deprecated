/// <reference path="../typings/main.d.ts" />
import ModuleEmitter from '../event/ModuleEmitter';
import { CONSTANTS, GethConnector } from '@akashaproject/geth-connector';
import { join } from 'path';
import { app } from 'electron';
import { GETH_LOGGER } from '../config/settings';
import Logger from './Logger';
import gethModule from './geth';
import channels from '../channels';
import { mainResponse } from '../event/responses';

const peers = require('../config/peers.json');

class GethIPC extends ModuleEmitter {

    constructor() {
        super();
        this.MODULE_NAME = 'geth';
        this.DEFAULT_MANAGED = ['startService', 'stopService', 'status'];
        this.attachEmitters();
    }

    public initListeners(webContents) {
        // set default options
        GethConnector.getInstance().setBinPath(join(app.getPath('userData'), 'go-ethereum'));
        GethConnector.getInstance().setOptions({
            datadir: join(GethConnector.getDefaultDatadir(), 'rinkeby'),
            ipcpath: join(GethConnector.getDefaultDatadir().replace(':', '\\'), 'rinkeby', 'geth.ipc'),
            networkid: 4,
            syncmode: 'fast',
            rinkeby: ''
            // rpc: '',
            // rpccorsdomain: '*',
            // rpcapi: 'eth,net,web3,personal,admin,shh,txpool',
            // rpcaddr: '0.0.0.0'
        });
        GethConnector.getInstance().setLogger(
            Logger.getInstance().registerLogger(GETH_LOGGER)
        );
        this.webContents = webContents;
        this._initMethods(gethModule);
        this._manager();
    }

    public attachEmitters() {
        this._download()
            ._fatal()
            ._starting()
            ._started()
            ._upgrading()
            ._stopped();
        return true;
    }

    private _download() {
        GethConnector.getInstance().on(
            CONSTANTS.DOWNLOAD_STARTED, () => {
                this.fireEvent(channels.client.geth.startService, mainResponse({ downloading: true }, {}));
            }
        );
        GethConnector.getInstance().on(
            CONSTANTS.DOWNLOAD_PROGRESS, (stats) => {
                this.fireEvent(channels.client.geth.startService, mainResponse({
                    downloading: true,
                    progress: stats
                }, {}));
            }
        );
        return this;
    }

    /**
     * Forward @event GethConnector#STARTING
     * @returns {GethIPC}
     * @private
     */
    private _starting() {
        GethConnector.getInstance().on(
            CONSTANTS.STARTING, () => {
                this.fireEvent(channels.client.geth.startService, mainResponse({ starting: true }, {}));
            }
        );
        return this;
    }

    /**
     * Forward @event GethConnector#STARTED
     * @returns {GethIPC}
     * @private
     */
    private _started() {
        GethConnector.getInstance().on(
            CONSTANTS.ETH_NODE_OK, () => {
                this.fireEvent(channels.client.geth.startService, mainResponse({ started: true }, {}));
            }
        );

        GethConnector.getInstance().on(
            CONSTANTS.IPC_CONNECTED, () => {
                this.fireEvent(channels.client.geth.startService, mainResponse({ ipc: true }, {}));
                peers.list.forEach((peer: string) => {
                    GethConnector.getInstance().web3.admin.addPeerAsync(peer).then(() => null);
                });
            }
        );
        return this;
    }

    /**
     * Forward @event GethConnector#STOPPED
     * @returns {GethIPC}
     * @private
     */
    private _stopped() {
        GethConnector.getInstance().on(
            CONSTANTS.STOPPED, () => {
                this.fireEvent(channels.client.geth.stopService, mainResponse({ stopped: true }, {}));
            }
        );
        return this;
    }

    /**
     * Forward @event GethConnector#FATAL
     * @returns {GethIPC}
     * @private
     */
    private _fatal() {
        GethConnector.getInstance().on(
            CONSTANTS.FATAL, (message: string) => {
                this.fireEvent(channels.client.geth.startService,
                    mainResponse({ error: message }, {})
                );
            }
        );
        return this;
    }

    /**
     * Notify when upgrading geth version
     * @returns {GethIPC}
     * @private
     */
    private _upgrading() {
        GethConnector.getInstance().once(
            CONSTANTS.UPDATING_BINARY, (message: string) => {
                this.fireEvent(channels.client.geth.startService,
                    mainResponse({ upgrading: true, message }, {})
                );
            }
        );
        GethConnector.getInstance().once(
            CONSTANTS.BINARY_CORRUPTED, (message: string) => {
                this.fireEvent(channels.client.geth.startService,
                    mainResponse({ error: message }, {})
                );
            }
        );
        return this;
    }
}

export default GethIPC;
