const { ipcRenderer } = require('electron');
import { EVENTS } from '../../electron-api/modules/settings';

export function startLogger (logger, options) {
    ipcRenderer.send(EVENTS.server.logger[logger], options ? options.continuous : false);
}
export function getGethLogs (cb) {
    ipcRenderer.on(EVENTS.client.logger.gethInfo, (ev, data) => {
        if (!data) {
            return cb('Main process does not respond!');
        }
        return cb(null, data);
    });
}

export function removeGethLogListener (listener, cb) {
    ipcRenderer.removeListener(EVENTS.client.logger.stopGethInfo, listener);
    return cb();
}
