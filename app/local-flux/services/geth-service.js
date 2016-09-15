import { ipcRenderer } from 'electron';
import debug from 'debug';
import BaseService from './base-service';
const dbg = debug('App:GethService:');

/**
 * Default managed channels: [startService, stopService, status]
 */
class GethService extends BaseService {
    /**
     * sends start Geth command to main process w/o options
     * @param {null | object} options
     * @return promise
     */
    startGeth = (options) =>
        new Promise((resolve, reject) => {
            const gethOptions = {};

            Object.keys(options).forEach(key => {
                if (key !== 'name' && options[key] !== '') {
                    gethOptions[key] = options[key];
                }
            });

            const listenerCb = (event, response) => {
                dbg('geth status', response);
                if (response.error) {
                    return reject(response.error);
                }
                return resolve(response.data);
            };
            if (this._listeners.get(Channel.client.geth.startService)) {
                return;
            }
            dbg('starting geth with options', gethOptions);
            this.registerListener(Channel.client.geth.startService, listenerCb, () =>
                ipcRenderer.send(Channel.server.geth.startService, gethOptions)
            );
        });

    stopGeth = () =>
        new Promise((resolve, reject) => {
            dbg('Stopping Geth service on channel:', Channel.client.geth.stopService);
            const listenerCb = (event, response) => {
                dbg('geth stop status is', response);
                if (response.error) {
                    return reject(response.error);
                }
                return resolve(response.data);
            };
            if (this._listeners.get(Channel.client.geth.stopService)) {
                return;
            }
            this.registerListener(Channel.client.geth.stopService, listenerCb, () => 
                ipcRenderer.send(Channel.server.geth.stopService, {})
            );
        });

    getStatus = () =>
        new Promise((resolve, reject) => {
            dbg('Retrieving Geth status', Channel.client.geth.status);
            const callback = (event, response) => {
                dbg(response, 'geth status');
                if (response.error) {
                    return reject(response.error);
                }
                return resolve(response.data);
            };
            if (this._listeners.get(Channel.client.geth.status)) {
                return;
            }
            this.registerListener(Channel.client.geth.status, callback, () => {
                ipcRenderer.send(Channel.server.geth.status, {});
            });
        });

    getOptions = () => {
        const clientChannel = Channel.client.geth.options;
        const serverChannel = Channel.server.geth.options;
        const serverManager = Channel.server.geth.manager;
        const clientManager = Channel.client.geth.manager;

        return new Promise((resolve, reject) => {
            const listenerCb = (event, response) => {
                dbg('Requested geth options', response);
                if (response.error) {
                    return reject(response.error);
                }
                return resolve(response.data);
            };
            if (this._listeners.get(clientChannel)) {
                return;
            }
            this.openChannel({
                serverManager,
                clientManager,
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
    startUpdateSync = () => {
        const clientChannel = Channel.client.geth.syncUpdate;
        const serverChannel = Channel.server.geth.syncUpdate;
        const serverManager = Channel.server.geth.manager;
        const clientManager = Channel.client.geth.manager;

        return new Promise((resolve, reject) => {
            const listenerCb = (ev, res) => {
                if (res.error) {
                    return reject(res.error);
                }
                return resolve(res.data);
            };
            if (this._listeners.get(clientChannel)) {
                return resolve();
            }
            this.openChannel({
                serverManager,
                clientManager,
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
