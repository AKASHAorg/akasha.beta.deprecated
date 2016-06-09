const { ipcRenderer } = require('electron');
import { EVENTS } from '../../electron-api/modules/settings';
import _ from 'lodash';

class SetupService {
    constructor () {
        this.listeners = [];
    }
    removeListeners (channel, listener) {
        ipcRenderer.removeListeners(channel, listener);
    }
    /**
     * sends start Geth command to main process w/o options
     * @param {null | object} options
     * @return promise
     */
    startGeth = (options) =>
        new Promise((resolve, reject) => {
            ipcRenderer.send(EVENTS.server.geth.startService, options);
            ipcRenderer.on(EVENTS.client.geth.startService,
                (event, data) => {
                // no data means that something very bad happened
                // like losing the main process
                    if (!data) {
                        return reject('OMG! Main process doesn`t respond to us!');
                    }
                    // return reject({ status: false });
                    return resolve(data);
                });
        });

    stopGeth = () =>
        new Promise((resolve, reject) => {
            ipcRenderer.send(EVENTS.server.geth.stopService);
            ipcRenderer.on(EVENTS.client.geth.stopService, (event, data) => {
                // no data means that something very bad happened
                // like losing the main process
                if (!data) {
                    return reject('OMG! Main process doesn`t respond to us!');
                }
                return resolve(data);
            });
        });
    /**
     * Send start IPFS service command to main process. Optionally can pass options
     * @param {null | object} options
     * @return promise
     */
    startIPFS = (options) =>
        new Promise((resolve, reject) => {
            ipcRenderer.send(EVENTS.server.ipfs.startService, options);
            ipcRenderer.on(EVENTS.client.ipfs.startService, (event, data) => {
                // no data means that something very bad happened
                // like losing the main process
                if (!data) {
                    return reject('OMG! Main process doesn`t respond to us!');
                }
                return resolve(data);
            });
        });

    stopIPFS = () =>
        new Promise((resolve, reject) => {
            ipcRenderer.send(EVENTS.server.ipfs.stopService);
            ipcRenderer.on(EVENTS.client.ipfs.stopService, (event, data) => {
                // no data means that something very bad happened
                // like losing the main process
                if (!data) {
                    return reject('OMG! Main process doesn`t respond to us!');
                }
                return resolve(data);
            });
        });
    /**
     * Update sync status sent by main process
     * @param {function} cb callback
     */
    startUpdateSync = (cb) => {
        ipcRenderer.on(EVENTS.client.geth.syncUpdate, (event, data) => {
            if (!data) {
                return cb('Main process does not respond!');
            }
            return cb(null, data);
        });
    }
    stopUpdateSync = (listener, cb) => {
        ipcRenderer.removeListener(EVENTS.client.geth.syncUpdate, listener);
        return cb();
    }
}

export { SetupService };
