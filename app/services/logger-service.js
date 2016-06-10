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
        ipcRenderer.send(stopChannel);
        ipcRenderer.once(stopChannel, (ev, data) => {
            if (!data) {
                const error = new Error('Sorry but the main process refuses to communicate');
                cb(error);
            }
            this.removeListener(EVENTS.client.logger.gethInfo);
            return cb(data);
        });
    }

    startGethInfo = (cb) => {
        const channel = EVENTS.client.logger.gethInfo;
        if (this.listeners[channel]) {
            this.removeListener(channel);
        }
        this.listeners[channel] = (ev, data) => {
            if (!data) {
                return cb('Main process does not respond!');
            }
            return cb(null, data);
        };
        return ipcRenderer.on(EVENTS.client.logger.gethInfo, this.listeners[channel]);
    }
}
export { LoggerService };
