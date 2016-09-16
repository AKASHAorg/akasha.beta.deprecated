import { ipcRenderer } from 'electron';
import debug from 'debug';
import BaseService from './base-service';
const dbg = debug('App:GethService:');

/**
 * Default managed channels: [startService, stopService, status]
 */
class GethService extends BaseService {
    constructor () {
        super();
        this.serverManager = Channel.server.geth.manager;
        this.clientManager = Channel.client.geth.manager;
    }
    /**
     * sends start Geth command to main process w/o options
     * @param {object} options Optional params
     * @return promise
     */
    start = options => {
        const serverChannel = Channel.server.geth.startService;
        const clientChannel = Channel.client.geth.startService;
        const gethOptions = {};

        if (this._listeners.get(clientChannel)) {
            return Promise.resolve();
        }

        Object.keys(options).forEach((key) => {
            if (key !== 'name' && options[key] !== '') {
                gethOptions[key] = options[key];
            }
        });

        return new Promise((resolve, reject) => {
            const listenerCb = (event, response) => {
                dbg('geth status', response);
                if (response.error) {
                    return reject(response.error);
                }
                return resolve(response.data);
            };
            dbg('starting geth with options', gethOptions);
            this.registerListener(clientChannel, listenerCb, () =>
                ipcRenderer.send(serverChannel, gethOptions)
            );
        });
    };
    /**
     * Stop Geth process
     */
    stop = () => {
        const serverChannel = Channel.server.geth.stopService;
        const clientChannel = Channel.client.geth.stopService;
        dbg('Stopping Geth service on channel:', clientChannel);
        if (this._listeners.get(Channel.client.geth.stopService)) {
            return Promise.resolve();
        }
        return new Promise((resolve, reject) => {
            const listenerCb = (event, res) => {
                dbg('geth stop status is', res);
                if (res.error) {
                    return reject(res.error);
                }
                return resolve(res.data);
            };
            this.registerListener(clientChannel, listenerCb, () => 
                ipcRenderer.send(serverChannel, {})
            );
        });
    }
    /**
     * Restart Geth
     * @params timer? <Number> milliseconds to wait before starting again
     */
    restart = (timer = 6000) => {
        const serverChannel = Channel.server.geth.restartService;
        const clientChannel = Channel.client.geth.restartService;

        return new Promise((resolve, reject) => {
            if (this._listeners.get(clientChannel)) {
                return;
            }
            const listenerCb = (ev, res) => {
                dbg('restarting geth', res);
                if (res.error) {
                    return reject(res.error);
                }
                return resolve(res.data);
            };
            this.openChannel({
                serverManager: this.serverManager,
                clientManager: this.clientManager,
                serverChannel,
                clientChannel,
                listenerCb
            }, () =>
                ipcRenderer.send(serverChannel, {})
            );
        });
    };
    /**
     *  Retrieve Geth logs
     */
    getLogs = () => {
        const serverChannel = Channel.server.geth.logs;
        const clientChannel = Channel.client.geth.logs;
        return new Promise((resolve, reject) => {
            if (this._listeners.get(clientChannel)) {
                return;
            }
            const listenerCb = (ev, res) => {
                if (res.error) {
                    return reject(res.error);
                }
                return resolve(res.data);
            };
            this.openChannel({
                serverManager: this.serverManager,
                clientManager: this.clientManager,
                serverChannel,
                clientChannel,
                listenerCb
            }, () =>
                ipcRenderer.send(serverChannel, {})
            );
        });
    };
    /**
     *  Get current status of geth;
     *  @response data = {
     *      downloading?: boolean;
     *      starting?: boolean;
     *      api: boolean;
     *      spawned: boolean;
     *      started?: boolean;
     *      stopped?: boolean;
     *  }
     */
    getStatus = () => {
        const serverChannel = Channel.server.geth.status;
        const clientChannel = Channel.client.geth.status;

        if (this._listeners.get(clientChannel)) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            dbg('Retrieving Geth status', clientChannel);
            const listenerCb = (event, res) => {
                dbg(res, 'geth status');
                if (res.error) {
                    return reject(res.error);
                }
                return resolve(res.data);
            };
            this.registerListener(clientChannel, listenerCb, () => {
                ipcRenderer.send(serverChannel, {});
            });
        });
    }
    /**
     * Retrieve options used by geth
     */
    getOptions = () => {
        const clientChannel = Channel.client.geth.options;
        const serverChannel = Channel.server.geth.options;

        if (this._listeners.get(clientChannel)) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const listenerCb = (event, res) => {
                dbg('Requested geth options', res);
                if (res.error) {
                    return reject(res.error);
                }
                return resolve(res.data);
            };

            this.openChannel({
                serverManager: this.serverManager,
                clientManager: this.clientManager,
                serverChannel,
                clientChannel,
                listenerCb
            }, () =>
                ipcRenderer.send(serverChannel, {})
            );
        });
    };
    /**
     * Update sync status sent by main process
     * @param {function} cb callback
     */
    getSyncStatus = () => {
        const clientChannel = Channel.client.geth.syncUpdate;
        const serverChannel = Channel.server.geth.syncUpdate;

        if (this._listeners.get(clientChannel)) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const listenerCb = (ev, res) => {
                if (res.error) {
                    return reject(res.error);
                }
                return resolve(res.data);
            };

            this.openChannel({
                serverManager: this.serverManager,
                clientManager: this.clientManager,
                serverChannel,
                clientChannel,
                listenerCb
            }, () =>
                ipcRenderer.send(serverChannel, {})
            );
        });
    }
}

export { GethService };
