import settingsDB from './db/settings';
import BaseService from './base-service';

class SettingsService extends BaseService {
    saveSettings = ({
        options,
        onError = () => {
        },
        onSuccess
    }) => {
        const settings = options.settings;
        return settingsDB[options.table].put({ name: options.table, ...settings })
            .then(() => {
                onSuccess(options.settings, options.table);
            }).catch((reason) => {
                onError(reason, options.table);
            });
    };
    getSettings = ({
        options = { table: '', query: {} },
        onError = () => {
        },
        onSuccess
    }) => {
        settingsDB[options.table].where('name').equals(options.table).toArray()
            .then((data) => {
                onSuccess(data[0] || {}, options.table);
            }).catch((reason) => {
                onError(reason, options.table);
            });
    }
}

export { SettingsService };
