import { ipcRenderer } from 'electron';
import { EVENTS } from '../../electron-api/modules/settings';
import settingsDB from './db/settings';

class SettingsService {
    saveSettings (table, settings) {
        return settingsDB[table].toArray().each().then(collection => {
            collection.delete();
        })
        .then(() => {
            return settingsDB.transaction('rw', settingsDB[table], () => {
                return settingsDB[table].put(settings);
            });
        });
    }
    getSettings (table, query) {
        let q = {};
        if (query) {
            q = query;
        }
        return settingsDB.transaction('r', settingsDB[table], () => {
            return settingsDB[table].toArray();
        });
    }
}
export { SettingsService };
