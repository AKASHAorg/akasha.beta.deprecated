import { akashaDB, getSettingsCollection } from './db/dbs';
import * as Promise from 'bluebird';

const GLOBAL_TYPE = 'global';
const USER_TYPE = 'user';

const getSettings = table => {
    try {
        const settings = getSettingsCollection().findOne({ opType: GLOBAL_TYPE, name: table });
        return Promise.resolve(settings ? Object.assign({}, settings) : {});
    } catch (error) {
        return Promise.reject(error);
    }
};

const saveSettings = (table, payload) => {
    try {
        const record = getSettingsCollection().findOne({ opType: GLOBAL_TYPE, name: table });
        if (record) {
            getSettingsCollection().findAndUpdate({ opType: GLOBAL_TYPE, name: table }, rec =>
                Object.assign(rec, payload)
            );
        } else {
            getSettingsCollection().insert(Object.assign({
                opType: GLOBAL_TYPE,
                name: table
            }, payload));
        }
        return Promise.fromCallback(cb => akashaDB.saveDatabase(cb)).then(() => Object.assign({}, payload));
    } catch (error) {
        return Promise.reject(error);
    }
};

export const appSettingsRequest = () => getSettings('general');
export const gethSettingsRequest = () => getSettings('geth');
export const ipfsSettingsRequest = () => getSettings('ipfs');
export const userSettingsRequest = ethAddress => {
    try {
        const record = getSettingsCollection().findOne({ opType: USER_TYPE, name: ethAddress });
        return Promise.resolve(record ? Object.assign(record) : {});
    } catch (error) {
        return Promise.reject(error);
    }
};

export const appSettingsSave = payload => saveSettings('general', payload);
export const gethSettingsSave = payload => saveSettings('geth', payload);
export const ipfsSettingsSave = payload => saveSettings('ipfs', payload);
export const userSettingsSave = (ethAddress, payload) => {
    try {
        const record = getSettingsCollection().findOne({ opType: USER_TYPE, name: ethAddress });
        if (record) {
            getSettingsCollection().findAndUpdate({ opType: USER_TYPE, name: ethAddress }, rec =>
                Object.assign(rec, payload)
            );
        } else {
            getSettingsCollection().insert(Object.assign({
                opType: USER_TYPE,
                name: ethAddress
            }, payload));
        }
        return Promise.fromCallback(cb => akashaDB.saveDatabase(cb)).then(() => payload);
    } catch (error) {
        return Promise.reject(error);
    }
};
export const userSettingsAddTrustedDomain = (ethAddress, domain) => {
    try {
        getSettingsCollection().findAndUpdate({ opType: USER_TYPE, name: ethAddress }, user => {
            if (!user.trustedDomains) {
                user.trustedDomains = [];
            }
            user.trustedDomains.push(domain);
        });
        const userSettings = getSettingsCollection().findOne({
            opType: USER_TYPE,
            name: ethAddress
        });
        return Promise.fromCallback(cb => akashaDB.saveDatabase(cb)).then(() =>
            Object.assign({}, userSettings)
        );
    } catch (error) {
        return Promise.reject(error);
    }
};
