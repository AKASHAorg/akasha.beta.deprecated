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

    saveLastBlockNr = ({ akashaId, blockNr }) => {
        settingsDB.user.where('akashaId').equals(akashaId).toArray()
            .then((data) => {
                const result = data[0] || {};
                result.lastBlockNr = blockNr;
                settingsDB.user.put({ akashaId, ...result });
            })
            .catch(reason => null);
    };

    getUserSettings = ({ akashaId, onSuccess, onError }) => {
        settingsDB.user.where('akashaId').equals(akashaId).toArray()
            .then(data => {
                onSuccess(data[0]);
            })
            .catch(reason => onError(reason));
    };
}

export { SettingsService };
