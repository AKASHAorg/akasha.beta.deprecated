/// <reference path="../typings/main.d.ts" />
import ModuleEmitter from '../event/ModuleEmitter';
import { GethConnector, CONSTANTS } from '@akashaproject/geth-connector';
import { join } from 'path';
import { app } from 'electron';
import { BOOTNODE, GETH_LOGGER } from '../config/settings';
import Logger from './Logger';
import gethModule from './geth';
import channels from '../channels';
import { gethResponse } from '../event/responses';
import { constructed } from '../contracts/index';
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
        GethConnector.getInstance().setBinPath(app.getPath('userData'));
        GethConnector.getInstance().setOptions({
            bootnodes: BOOTNODE,
            datadir: join(GethConnector.getDefaultDatadir(), 'akasha-alpha'),
            ipcpath: join(GethConnector.getDefaultDatadir(), 'akasha-alpha', 'geth.ipc'),
            networkid: 511337,
            shh: ''
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
            ._error()
            ._fatal()
            ._starting()
            ._started()
            ._upgrading()
            ._stopped();
        return true;
    }

    private _download() {
        GethConnector.getInstance().on(
            CONSTANTS.DOWNLOADING_BINARY, () => {
                this.fireEvent(channels.client.geth.startService, gethResponse({ downloading: true }, {}));
            }
        );
        return this;
    }

    /**
     * Forward @event GethConnector#STARTING
     * @returns {GethEmitter}
     * @private
     */
    private _starting() {
        GethConnector.getInstance().on(
            CONSTANTS.STARTING, () => {
                this.fireEvent(channels.client.geth.startService, gethResponse({ starting: true }, {}));
            }
        );
        return this;
    }

    /**
     * Forward @event GethConnector#STARTED
     * @returns {GethEmitter}
     * @private
     */
    private _started() {
        GethConnector.getInstance().on(
            CONSTANTS.STARTED, () => {
                this.fireEvent(channels.client.geth.startService, gethResponse({ started: true }, {}));
            }
        );

        GethConnector.getInstance().on(
            CONSTANTS.IPC_CONNECTED, () => {
                this.fireEvent(channels.client.geth.startService, gethResponse({}, {}));
                // inject web3 instance
                constructed.init(GethConnector.getInstance().web3);
                // add static peers
                peers.list.forEach((peer: string) => {
                    GethConnector.getInstance().web3.admin.addPeerAsync(peer).then(() => null);
                });
            }
        );
        return this;
    }

    /**
     * Forward @event GethConnector#STOPPED
     * @returns {GethEmitter}
     * @private
     */
    private _stopped() {
        GethConnector.getInstance().on(
            CONSTANTS.STOPPED, () => {
                this.fireEvent(channels.client.geth.stopService, gethResponse({ stopped: true }, {}));
            }
        );
        return this;
    }

    /**
     * Forward @event GethConnector#FATAL
     * @returns {GethEmitter}
     * @private
     */
    private _fatal() {
        GethConnector.getInstance().on(
            CONSTANTS.FATAL, (message: string) => {
                this.fireEvent(channels.client.geth.startService,
                    gethResponse({}, { message, fatal: true })
                );
            }
        );
        return this;
    }

    /**
     * Forward @event GethConnector#ERROR
     * @returns {GethEmitter}
     * @private
     */
    private _error() {
        GethConnector.getInstance().on(
            CONSTANTS.ERROR, (message: string) => {
                this.fireEvent(channels.client.geth.startService,
                    gethResponse({}, { message })
                );
            }
        );
        return this;
    }

    /**
     * Notify when upgrading geth version
     * @returns {GethEmitter}
     * @private
     */
    private _upgrading() {
        GethConnector.getInstance().once(
            CONSTANTS.UPDATING_BINARY, (message: string) => {
                this.fireEvent(channels.client.geth.startService,
                    gethResponse({ upgrading: true, message }, {})
                );
            }
        );
        GethConnector.getInstance().once(
            CONSTANTS.BINARY_CORRUPTED, (message: string) => {
                this.fireEvent(channels.client.geth.startService,
                    gethResponse({}, { message })
                );
            }
        );
        return this;
    }
}
export default GethIPC;
