import { ipcRenderer } from 'electron';
import { EVENTS } from '../../electron-api/modules/settings';

class SetupService {
    constructor () {
        this.listeners = {};
    }
    removeListener (channel) {
        ipcRenderer.removeListener(channel, this.listeners[channel]);
    }
    /**
     * Update sync status sent by main process
     * @param {function} cb callback
     */
    startUpdateSync = (cb) => {
        const channel = EVENTS.client.geth.syncUpdate;
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
        if (typeof this.listeners[channel] === 'function') {
            this.removeListener(channel);
            this.listeners[channel] = null;
        }
        if (cb) {
            return cb();
        }
    }
}

export { SetupService };
