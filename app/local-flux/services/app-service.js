import { ipcRenderer } from 'electron';
import { EVENTS } from '../../../electron-api/modules/settings';
import BaseService from './base-service';
import debug from 'debug';
const dbg = debug('App:AppService:');

class AppService extends BaseService {
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
