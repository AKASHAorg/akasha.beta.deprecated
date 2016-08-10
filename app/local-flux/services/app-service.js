import { ipcRenderer } from 'electron';
import { EVENTS } from '../../../electron-api/modules/settings';
import debug from 'debug';
const dbg = debug('App:AppService:');

class AppService {
    checkForUpdates = () =>
        new Promise((resolve, reject) => {
            dbg('Checking for updates');
            return resolve({ hasUpdates: false });
        });
    updateApp = () =>
        new Promise((resolve, reject) => {
            dbg('Updating app');
            return resolve({ success: true });
        })
}

export { AppService };
