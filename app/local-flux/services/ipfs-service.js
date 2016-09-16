import { ipcRenderer } from 'electron';
import BaseService from './base-service';

const Channel = window.Channel;
/**
 * Ipfs process management
 * default open channels => ['startService', 'stopService', 'status', 'resolve']
 * channels => ['manager', 'startService', 'stopService', 'status', 'resolve']
 */
class IpfsService extends BaseService {
    constructor () {
        super();
        this.serverManager = Channel.server.ipfs.manager;
        this.clientManager = Channel.client.ipfs.manager;
    }
    /**
     * Send start IPFS service command to main process.
     * @param {object} options
     * @return promise
     */
    start = (options) => {
        const serverChannel = Channel.server.ipfs.startService;
        const clientChannel = Channel.client.ipfs.startService;
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
            this.registerListener(clientChannel, listenerCb, () =>
                ipcRenderer.send(serverChannel, options)
            );
        });
    }
    /**
     * Stop ipfs service
     */
    stop = () => {
        const serverChannel = Channel.server.ipfs.stopService;
        const clientChannel = Channel.client.ipfs.stopService;
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

            this.registerListener(clientChannel, listenerCb, () =>
                ipcRenderer.send(serverChannel, {})
            );
        });
    }
    /**
     * get ipfs status
     * @response data = {
     *      downloading?: boolean;
     *      api: boolean;
     *      spawned: boolean;
     *      started?: boolean;
     *      stopped?: boolean;
     * }
     */
    getStatus = () => {
        const serverChannel = Channel.server.ipfs.status;
        const clientChannel = Channel.client.ipfs.status;
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
            this.registerListener(clientChannel, listenerCb, () =>
                ipcRenderer.send(serverChannel, {})
            );
        });
    }
    resolve = (ipfsHash) => {
        const serverChannel = Channel.server.ipfs.resolve;
        const clientChannel = Channel.client.ipfs.resolve;
        if (this._listeners.get(clientChannel)) {
            return Promise.resolve();
        }
        return new Promise((resolve, reject) => {
            const listenerCb = (ev, res) => {
                if (res.error) return reject(res.error);
                return resolve(res.data);
            };
            this.registerListener(clientChannel, listenerCb, () =>
                ipcRenderer.send(serverChannel, { hash: ipfsHash })
            );
        });
    }
}

export { IpfsService };
