import * as Promise from 'bluebird';
import { autoUpdater } from 'electron-updater';
const log = require('electron-log');

const execute = Promise.coroutine(function* () {
    if (
        process.env.NODE_ENV !== 'development' &&
        (process.platform === 'darwin' || process.platform === 'win32')
    ) {
        log.transports.file.level = 'info';
        autoUpdater.logger = log;
        autoUpdater.checkForUpdatesAndNotify();
    }
    return Promise.resolve({ done: true });
});

export default { execute, name: 'checkUpdate' };
