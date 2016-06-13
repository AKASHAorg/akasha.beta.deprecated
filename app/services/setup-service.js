import { ipcRenderer } from 'electron';
import { EVENTS } from '../../electron-api/modules/settings';
import _ from 'lodash';

class SetupService {
    constructor () {
        this.listeners = {};
    }
    removeListener (channel) {
        ipcRenderer.removeListener(channel, this.listeners[channel]);
    }
    /**
     * sends start Geth command to main process w/o options
     * @param {null | object} options
     * @return promise
     */
    startGeth = (options) =>
        new Promise((resolve, reject) => {
            ipcRenderer.send(EVENTS.server.geth.startService, options);
            ipcRenderer.once(EVENTS.client.geth.startService,
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
            ipcRenderer.once(EVENTS.client.geth.stopService, (event, data) => {
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
            ipcRenderer.once(EVENTS.client.ipfs.startService, (event, data) => {
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
            ipcRenderer.once(EVENTS.client.ipfs.stopService, (event, data) => {
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
        const channel = EVENTS.client.geth.syncUpdate;
        if (this.listeners[channel]) {
            this.removeListener(channel);
        }
        this.listeners[channel] = (ev, data) => {
            if (!data) {
                return cb('Main process does not respond!');
            }
            return cb(null, data);
        };
        return ipcRenderer.on(EVENTS.client.geth.syncUpdate, this.listeners[channel]);
    }
    stopUpdateSync = (cb) => {
        const channel = EVENTS.client.geth.syncUpdate;
        this.removeListener(channel);
        return cb();
    }
}

export { SetupService };
