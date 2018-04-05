import {akashaDB, getProfileCollection} from './db/dbs';
import * as Promise from 'bluebird';

export const IS_LOGGED_TYPE = 'loggedProfile';
export const LAST_BLOCK_TYPE = 'lastBlockNrs';

export const profileDeleteLogged = () => {
    try {
        getProfileCollection().findAndRemove({opType: IS_LOGGED_TYPE});
        return Promise.fromCallback(cb => akashaDB.saveDatabase(cb));
    } catch (error) {
        return Promise.reject(error);
    }
};

export const profileGetLogged = () => {
    try {
        const record = getProfileCollection().findOne({opType: IS_LOGGED_TYPE});
        return Promise.resolve(Object.assign({}, record));
    } catch (error) {
        return Promise.reject(error);
    }
};

export const profileSaveLogged = profile => {
    try {
        return profileGetLogged()
            .then(d => {
                if (d) {
                    return profileDeleteLogged();
                }
                return Promise.resolve(true);
            })
            .then(() => {
                const record = Object.assign({opType: IS_LOGGED_TYPE}, profile);
                getProfileCollection().insertOne(record, false);
                return Promise.fromCallback(cb => akashaDB.saveDatabase(cb));
            });
    } catch (error) {
        return Promise.reject(error);
    }
};

export const profileUpdateLogged = profile =>
    profileSaveLogged(profile);

export const profileSaveLastBlockNr = payload => {
    try {
        const record = getProfileCollection().findOne({opType: LAST_BLOCK_TYPE, ethAddress: payload.ethAddress});
        if (!record) {
            getProfileCollection().insert(Object.assign({opType: LAST_BLOCK_TYPE}, payload));
        } else {
            getProfileCollection()
                .findAndUpdate(
                    {opType: LAST_BLOCK_TYPE, ethAddress: payload.ethAddress},
                    (rec) => Object.assign(rec, payload, {opType: LAST_BLOCK_TYPE})
                )
        }
        return Promise.fromCallback(cb => akashaDB.saveDatabase(cb)).then(() => payload);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const profileGetLastBlockNr = ethAddress => {
    try {
        const record = getProfileCollection().findOne({opType: LAST_BLOCK_TYPE, ethAddress: ethAddress});
        return Promise.resolve(record? record.blockNr :0);
    } catch (error) {
        return Promise.reject(error);
    }
};

