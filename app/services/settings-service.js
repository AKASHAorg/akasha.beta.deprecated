import { ipcRenderer } from 'electron';
import { EVENTS } from '../../electron-api/modules/settings';
import settingsDB from './db/settings';

class SettingsService {
    saveSettings (table, settings) {
        return new Promise((resolve, reject) => {
            settingsDB.transaction('rw', settingsDB.geth, async() => {
                resolve(await settingsDB[table].add({ settings }));
            }).catch(err => reject(err));
        });
    }
    getSettings (table, query) {}
}
export { SettingsService };
