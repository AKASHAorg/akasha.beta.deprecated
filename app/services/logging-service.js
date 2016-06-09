const { ipcRenderer } = require('electron');
import { EVENTS } from '../../electron-api/modules/settings';

class LoggingService {
    constructor () {
        this.listeners = [];
    }
    removeListener (channel, listener) {
        ipcRenderer.removeListener(channel, listener);
    }
    startLogger = (logger, options) =>
        ipcRenderer.send(EVENTS.server.logger[logger], options ? options.continuous : false);
    stopLogger = (cb) => {
        this.removeListener(EVENTS.client.logger.stopGethInfo);
        return cb();
    }
    getGethLogs = (cb) => {
        ipcRenderer.on(EVENTS.client.logger.gethInfo, (ev, data) => {
            if (!data) {
                return cb('Main process does not respond!');
            }
            return cb(null, data);
        });
    }
}
export { LoggingService };
