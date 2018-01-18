import * as Promise from 'bluebird';
import { autoUpdater } from 'electron';

const execute = Promise.coroutine(function* () {
    if (
        process.env.NODE_ENV !== 'development' &&
        (process.platform === 'darwin' || process.platform === 'win32')
    ) {
        autoUpdater.checkForUpdates();
    }
    return Promise.resolve({ done: true });
});

export default { execute, name: 'checkUpdate' };
