import settingsDB from './db/settings';

class SettingsService {
    saveSettings (table, settings) {
        return settingsDB.transaction('rw', settingsDB[table], () =>
            settingsDB[table].put({ name: table, ...settings })
        );
    }
    getSettings (table, query) {
        let q = {};
        if (query) {
            q = query;
        }
        return settingsDB.transaction('r', settingsDB[table], () =>
            settingsDB[table].where('name').equals(table).toArray()
        );
    }
}
export { SettingsService };
