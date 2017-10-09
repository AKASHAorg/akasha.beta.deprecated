import settingsDB from './db/settings';

const getSettings = table =>
    new Promise((resolve, reject) =>
        settingsDB[table].where('name').equals(table).toArray()
            .then(data => resolve(data[0] || {}))
            .catch(error => reject(error))
    );

const saveSettings = (table, payload) =>
    new Promise((resolve, reject) => {
        settingsDB[table].where('name').equals(table).toArray()
            .then((data) => {
                if (data.length) {
                    settingsDB[table].where('name').equals(table).modify(payload)
                        .then(() => resolve(payload))
                        .catch(error => reject(error));
                } else {
                    settingsDB[table].put({ name: table, ...payload })
                        .then(() => resolve(payload))
                        .catch(error => reject(error));
                }
            });
    });

export const generalSettingsRequest = () => getSettings('general');
export const gethSettingsRequest = () => getSettings('geth');
export const ipfsSettingsRequest = () => getSettings('ipfs');
export const userSettingsRequest = ethAddress =>
    new Promise((resolve, reject) =>
        settingsDB.user.where('ethAddress').equals(ethAddress).toArray()
            .then(data => resolve(data[0] || {}))
            .catch(error => reject(error))
    );

export const generalSettingsSave = payload => saveSettings('general', payload);
export const gethSettingsSave = payload => saveSettings('geth', payload);
export const ipfsSettingsSave = payload => saveSettings('ipfs', payload);
export const userSettingsSave = (ethAddress, payload) =>
    new Promise((resolve, reject) => {
        settingsDB.user.where('ethAddress').equals(ethAddress).toArray()
            .then((data) => {
                const resp = { ethAddress, ...payload };
                if (data.length) {
                    settingsDB.user.where('ethAddress').equals(ethAddress).modify(payload)
                        .then(() => resolve(resp))
                        .catch(error => reject(error));
                } else {
                    settingsDB.user.put(resp)
                        .then(() => resolve(resp))
                        .catch(error => reject(error));
                }
            });
    });
