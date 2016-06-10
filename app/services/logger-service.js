import { ipcRenderer } from 'electron';
import { EVENTS } from '../../electron-api/modules/settings';

class LoggerService {
    constructor () {
        this.listeners = {};
    }
    removeListener (channel) {
        ipcRenderer.removeListener(channel, this.listeners[channel]);
    }
    startLogger = (logger, options, cb) => {
        ipcRenderer.send(EVENTS.server.logger[logger], options ? options.continuous : false);
        return cb();
    }

    stopGethInfo = (cb) => {
        const stopChannel = EVENTS.client.logger.stopGethInfo;
        const gethInfoChannel = EVENTS.client.logger.gethInfo;
        ipcRenderer.send(stopChannel);
        if (typeof this.listeners[gethInfoChannel] === 'function') {
            this.removeListener(EVENTS.client.logger.gethInfo);
            this.listeners[EVENTS.client.logger.gethInfo] = null;
        }
        return cb();
    }

    startGethInfo = (cb) => {
        const channel = EVENTS.client.logger.gethInfo;
        this.listeners[channel] = (ev, data) => {
            if (!data) {
                const error = new Error('Main process error');
                return cb(error);
            }
            return cb(null, data);
        };
        return ipcRenderer.on(EVENTS.client.logger.gethInfo, this.listeners[channel]);
    }
}
export { LoggerService };
