/// <reference path="../typings/main.d.ts" />
import ModuleEmitter from '../event/ModuleEmitter';
import { IpfsConnector, ipfsEvents } from '@akashaproject/ipfs-connector';
import AppLogger from './Logger';
import { IPFS_LOGGER, IPFS_PEER_ID } from '../config/settings';
import { app } from 'electron';
import ipfsModule from './ipfs';
import channels from '../channels';
import { mainResponse } from '../event/responses';
import WebContents = Electron.WebContents;

class IpfsIPC extends ModuleEmitter {
    constructor() {
        super();
        this.MODULE_NAME = 'ipfs';
        this.DEFAULT_MANAGED = ['startService', 'stopService', 'status', 'resolve'];
        this.attachEmitters();
    }

    public initListeners(webContents: WebContents) {
        IpfsConnector.getInstance().setLogger(
            AppLogger.getInstance().registerLogger(IPFS_LOGGER)
        );
        IpfsConnector.getInstance().setBinPath(app.getPath('userData'));
        this.webContents = webContents;
        this._initMethods(ipfsModule);
        this._manager();
    }

    public attachEmitters() {
        this._download()
            ._starting()
            ._catchCorrupted()
            ._catchFailed()
            ._catchError()
            ._started()
            ._stopped();
        return true;
    }

    private _download() {
        IpfsConnector.getInstance().on(
            ipfsEvents.DOWNLOAD_STARTED,
            () => {
                this.fireEvent(channels.client.ipfs.startService, mainResponse({ downloading: true }, {}));
            }
        );
        return this;
    }

    private _starting() {
        IpfsConnector.getInstance().on(
            ipfsEvents.SERVICE_STARTING,
            () => {
                this.fireEvent(channels.client.ipfs.startService, mainResponse({ starting: true }, {}));
            }
        );
        return this;
    }

    private _started() {
        IpfsConnector.getInstance().on(
            ipfsEvents.SERVICE_STARTED,
            () => {
                IpfsConnector.getInstance()
                    .api
                    .apiClient
                    .bootstrap
                    .add(IPFS_PEER_ID, (err) => {
                        if (err) {
                            console.log('add ipfs peer err ', err);
                        }
                        this.fireEvent(channels.client.ipfs.startService, mainResponse({ started: true }, {}));
                    });
            }
        );
        return this;
    }

    private _stopped() {
        IpfsConnector.getInstance().on(
            ipfsEvents.SERVICE_STOPPED,
            () => {
                this.fireEvent(channels.client.ipfs.stopService, mainResponse({ stopped: true }, {}));
            }
        );
        return this;
    }

    private _catchCorrupted() {
        IpfsConnector.getInstance().once(
            ipfsEvents.UPGRADING_BINARY, (message: string) => {
                this.fireEvent(channels.client.ipfs.startService,
                    mainResponse({ upgrading: true, message }, {})
                );
            });
        IpfsConnector.getInstance().on(
            ipfsEvents.BINARY_CORRUPTED,
            (err: Error) => {
                this.fireEvent(
                    channels.client.ipfs.startService,
                    mainResponse({ error: err }, {})
                );
            }
        );
        return this;
    }

    private _catchFailed() {
        IpfsConnector.getInstance().on(
            ipfsEvents.SERVICE_FAILED,
            (err: Error) => {
                this.fireEvent(
                    channels.client.ipfs.startService,
                    mainResponse({ error: err }, {})
                );
            }
        );
        return this;
    }

    private _catchError() {
        IpfsConnector.getInstance().on(
            ipfsEvents.ERROR,
            (message: string) => {
                this.fireEvent(
                    channels.client.ipfs.startService,
                    mainResponse({ error: message }, {})
                );
            });
        return this;
    }
}

export default IpfsIPC;
