/// <reference path="../../typings/main.d.ts" />
import IpfsEmitter from './event/IpfsEmitter';
import { IpfsConnector } from '@akashaproject/ipfs-connector';
import AppLogger from './Logger';
import channels from '../channels';
import { ipfsResponse } from './event/responses';
import WebContents = Electron.WebContents;
import IpcMainEvent = Electron.IpcMainEvent;

class IpfsIPC extends IpfsEmitter {
    public logger = 'ipfs';
    private DEFAULT_MANAGED: string[] = ['startService', 'stopService', 'status', 'resolve'];

    constructor() {
        super();
        this.attachEmitters();
    }

    public initListeners(webContents: WebContents) {
        IpfsConnector.getInstance().setLogger(
            AppLogger.getInstance().registerLogger(this.logger)
        );
        this.webContents = webContents;
        this._start()
            ._stop()
            ._status()
            ._resolve()
            ._getConfig()
            ._setPorts()
            ._getPorts()
            ._manager();
    }

    /**
     *
     * @returns {IpfsIPC}
     * @private
     */
    private _start() {
        this.registerListener(
            channels.server.ipfs.startService,
            (event: IpcMainEvent, data: IpfsStartRequest) => {
                if (data.storagePath) {
                    IpfsConnector.getInstance().setIpfsFolder(data.storagePath);
                }
                IpfsConnector.getInstance().start();
            }
        );
        return this;
    }

    /**
     *
     * @returns {IpfsIPC}
     * @private
     */
    private _stop() {
        this.registerListener(
            channels.server.ipfs.stopService,
            (event: IpcMainEvent, data: IpfsStopRequest) => {
                const signal = (data)? data.signal: 'SIGINT';
                IpfsConnector.getInstance().stop(signal);
            }
        );
        return this;
    }

    /**
     *
     * @private
     */
    private _manager() {
        this.registerListener(
            channels.server.ipfs.manager,
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
                            channels.client.ipfs.manager,
                            ipfsResponse({}, { message: `already listening on ${data.channel}` }),
                            event
                        );
                    }
                    // start listening for events on channel
                    this.listenEvents(data.channel);
                    // emit ok response
                    return this.fireEvent(channels.client.ipfs.manager, ipfsResponse(data), event);
                }
                // remove listener on `channel`
                return this.purgeListener(data.channel);
            }
        );
        // start listening immediately on `manager` channel
        this.listenEvents(channels.server.ipfs.manager);
        this.DEFAULT_MANAGED.forEach(
            (action: string) =>
                this.listenEvents(channels.server.ipfs[action])
        );
    }

    /**
     * ipfs service status
     * @private
     */
    private _status() {
        this.registerListener(
            channels.server.ipfs.status,
            (event: any) => {
                this.fireEvent(
                    channels.client.ipfs.status,
                    ipfsResponse({}),
                    event
                );
            }
        );
        return this;
    }

    /**
     * Fetch data from ipfs hashes or links
     * ex: QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG or
     * QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/someField
     * @private
     */
    private _resolve() {
        this.registerListener(
            channels.server.ipfs.resolve,
            (event: any, data: IpfsResolveRequest) => {
                let response: IpfsResolveResponse;
                IpfsConnector.getInstance()
                    .api
                    .resolve(data.hash)
                    .then((source: any) => {
                        response = ipfsResponse({ content: source, hash: data.hash });
                    })
                    .catch((error: Error) => {
                        console.log(error);
                        response = ipfsResponse({ hash: data.hash }, { message: error.message });
                    })
                    .finally(() => {
                        this.fireEvent(
                            channels.client.ipfs.resolve,
                            response,
                            event
                        );
                    });
            }
        );
        return this;
    }

    private _getConfig() {
        this.registerListener(
            channels.server.ipfs.getConfig,
            (event: any) => {
                let response: IpfsgetConfigResponse;
                response = ipfsResponse({
                    apiPort: IpfsConnector.getInstance().options.apiAddress.split('/').pop(),
                    storagePath: IpfsConnector.getInstance().options.extra.env.IPFS_PATH
                });
                this.fireEvent(
                    channels.client.ipfs.getConfig,
                    response,
                    event
                );
            }
        );
        return this;
    }

    private _setPorts() {
        this.registerListener(
            channels.server.ipfs.setPorts,
            (event: any, data: IpfsSetConfigRequest) => {
                let response: IpfsSetConfigResponse;
                IpfsConnector.getInstance()
                    .setPorts(data.ports, data.restart)
                    .then(() => {
                        response = ipfsResponse({ set: true });
                    })
                    .catch((err: Error) => {
                        response = ipfsResponse({}, {
                            message: err.message,
                            from: { ports: data.ports }
                        });
                    })
                    .finally(() => {
                        this.fireEvent(
                            channels.client.ipfs.setPorts,
                            response,
                            event
                        );
                    });
            }
        );
        return this;
    }

    private _getPorts() {
        this.registerListener(
            channels.server.ipfs.getPorts,
            (event: any) => {
                let response: IpfsGetPortsResponse;
                IpfsConnector.getInstance()
                    .getPorts()
                    .then((ports) => {
                        response = ipfsResponse(ports);
                    })
                    .catch((err: Error) => {
                        response = ipfsResponse({}, { message: err.message });
                    })
                    .finally(() => {
                        this.fireEvent(
                            channels.client.ipfs.getPorts,
                            response,
                            event
                        );
                    });
            }
        );
        return this;
    }

}

export default IpfsIPC;
